import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { MeshPhongMaterial, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import Delaunator from 'delaunator';
// import ImprovedNoise from './functions/improved-noise';

@Injectable({ providedIn: 'root' })
export class SimulationEngineService implements OnDestroy {
  private renderer!: THREE.WebGLRenderer;
  private raycaster!: THREE.Raycaster;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private frameId = 0;
  mouse = new THREE.Vector2(0, 0);
  MOVE_SPD = 0.5;
  private humanArray: THREE.Mesh[] = [];
  private lineArray: THREE.Line[] = [];
  private controls!: OrbitControls;

  colors = {
    infected: 0xff0066,
    healthy: 0x444444,
    immune: 0x66ccff,
    dead: 0xd9d9d9
  };
  animationSlowdown = 30;

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.frameId !== 0) {
      cancelAnimationFrame(this.frameId);
    }
  }

  init(canvas: HTMLCanvasElement): void {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 4000);
    this.camera.position.z = 0;
    this.camera.position.y = 0;
    this.camera.position.x = 1000;

    this.scene = new THREE.Scene();
    const light = new THREE.AmbientLight( 0xeeeeee, 1 );
    this.scene.add( light );
    const pointLight = new THREE.PointLight(0xffffff, 300, 300);
    this.scene.add(pointLight);
    this.scene.background = new THREE.Color(0xFFFFFF);

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.setupCameraMovement();
    this.setupMouse();
    this.raycaster = new THREE.Raycaster();
    this.renderer.setClearColor('white');
    this.animate();
  }

  setupMouse(): void{
    document.addEventListener( 'mousemove', (event) => {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );
  }

  setupCameraMovement(): void{
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  reset(): void{
    this.humanArray.forEach(mesh => {
      this.scene.remove(mesh);
    });
    this.lineArray.forEach(mesh => {
      this.scene.remove(mesh);
    });
    this.humanArray = [];
    this.lineArray = [];
  }

  makeNewHumanMesh(x: number, y: number, z: number): number{
    const material = new THREE.MeshStandardMaterial({
      color: this.colors.healthy,
      
    });
    const radius = 12;
    const humanGeometry = new THREE.TetrahedronBufferGeometry(radius, 0);
    const humanMesh = new THREE.Mesh(humanGeometry, material);
    humanMesh.position.set(x, y, z);
    humanMesh.rotation.set(x, y, z);
    this.humanArray.push(humanMesh);
    this.scene.add(humanMesh);
    return humanMesh.id;
  }

  drawLineBetweenMeshes(meshId1: number, meshId2: number): number{
    const mesh1 = this.scene.getObjectById(meshId1) as THREE.Mesh;
    const mesh2 = this.scene.getObjectById(meshId2) as THREE.Mesh;
    const meshMaterial1 = mesh1.material as THREE.MeshStandardMaterial;
    meshMaterial1.color = new THREE.Color(this.colors.infected);

    const meshMaterial2 = mesh2.material as THREE.MeshStandardMaterial;
    meshMaterial2.color = new THREE.Color(this.colors.infected);

    return this.drawLineBetweenPoints(mesh1.position, mesh2.position, 25);
  }

  drawLineBetweenPoints(coords1: THREE.Vector3, coords2: THREE.Vector3, split: number): number{
    const stepX = (coords2.x - coords1.x) / split;
    const stepY = (coords2.y - coords1.y) / split;
    const stepZ = (coords2.z - coords1.z) / split;
    const points: Vector3[] = [];

    const condition = coords1.x < coords2.x ? 1 : -1;
    for (let x = coords1.x, y = coords1.y, z = coords1.z; x * condition < coords2.x * condition; x += stepX, y += stepY, z += stepZ){
      points.push(new THREE.Vector3(x, y, z));
    }
    const material = new THREE.LineBasicMaterial( { color: 0xff0033 } );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    geometry.setDrawRange(0, 0);
    const line = new THREE.Line( geometry, material);
    this.lineArray.push(line);
    this.revealMoreLine(line, 0, split);
    this.scene.add(line);

    return line.id;
  }

  revealMoreLine(line: THREE.Line, revealedParts: number, max: number): void{
    if (revealedParts < max){
      this.wait(20).then(res => {
        revealedParts += 1;
        line.geometry.setDrawRange(0, revealedParts);
        this.revealMoreLine(line, revealedParts, max);
      });
    }
  }

  hideLine(lineId: number): void{
    const line = this.scene.getObjectById(lineId) as THREE.Line;
    line.geometry.setDrawRange(0, 0);
  }

  changeMeshColor(meshId: number, color: number): void{
    const mesh = this.scene.getObjectById(meshId) as THREE.Mesh;
    const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
    meshMaterial.color = new THREE.Color(color);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
  }

  private render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.controls.update();

    this.raycaster.setFromCamera( this.mouse, this.camera );

    for (const mesh of this.humanArray){
      const intersects = this.raycaster.intersectObject( mesh );
      const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
      if ( intersects.length > 0 ) {
        meshMaterial.color = new THREE.Color('red');
      } else {
      }
    }
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  wait(ms: number): Promise < any > {
    return new Promise(res => setTimeout(res, ms));
  }
}
