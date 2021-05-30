import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { MeshPhongMaterial } from 'three';
// import Delaunator from 'delaunator';
// import ImprovedNoise from './functions/improved-noise';

@Injectable({ providedIn: 'root' })
export class SimulationEngineService implements OnDestroy {
  private renderer!: THREE.WebGLRenderer;
  private raycaster!: THREE.Raycaster;
  private pointer!: THREE.Vector2;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private frameId = 0;

  mouse = new THREE.Vector2(0,0);
  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;
  count = 0;

  private SCREEN_WIDTH = window.innerWidth;
  private SCREEN_HEIGHT = window.innerHeight;

  private pointLight!: THREE.PointLight;
  MOVE_SPD = 0.5;

  private textureLoader = new THREE.TextureLoader();

  private octahedronsArray: THREE.Mesh[] = [];
  private TETRAHEDRON_COUNT = 40;

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
    this.camera.position.x = 0;

    this.scene = new THREE.Scene();

    const light = new THREE.AmbientLight( 0xeeeeee, 1 );
    this.scene.add( light );

    this.scene.background = new THREE.Color(0xFFFFFF);

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
    });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.addEventListener( 'mousemove', (event) => {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }, false );

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // window.addEventListener( 'resize', this.onWindowResize, false );

    this.renderer.setClearColor('white');
    this.animate();
  }

  getMeshById(uuid: string){
    return;
  }

  deleteHumanMeshes(){

  }

  makeNewHumanMesh(x: number, y: number, z: number): number{
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true
    });
    const radius = 40;
    const octahedronsGeometry = new THREE.TetrahedronBufferGeometry(radius, 0);
    const octahedronMesh = new THREE.Mesh(octahedronsGeometry, material);

    octahedronMesh.position.set(x, y, z);
    octahedronMesh.rotation.set(x, y, z);
    this.octahedronsArray.push(octahedronMesh);
    this.scene.add(octahedronMesh);
    return octahedronMesh.id;
  }

  drawLineBetweenHumans(human1: THREE.Mesh, human2: THREE.Mesh){
    
  }

  private onWindowResize(): void {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
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
    this.camera.position.x += ( this.mouse.x * this.windowHalfX - this.camera.position.x) * .01 ;
    this.camera.position.y += ( this.mouse.y * this.windowHalfY  - this.camera.position.y ) * .01;
    this.camera.position.z += ( - (this.mouse.y * this.windowHalfY ) + 800 - this.camera.position.z ) * .01;

    this.raycaster.setFromCamera( this.mouse, this.camera );
    /*
    const intersects = this.raycaster.intersectObjects( this.scene.children );

    for ( let i = 0; i < intersects.length; i ++ ) {
  
      intersects[ i ].object.material.color.set( 0xff0000 );
  
    }
    */

    for(let mesh of this.octahedronsArray){
      const intersects = this.raycaster.intersectObject( mesh );
      const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
      if ( intersects.length > 0 ) {
        meshMaterial.color = new THREE.Color(0,0,0);
        //const intersect = intersects[ 0 ];
      } else {
        //meshMaterial.color = new THREE.Color(0xffffff);
      }
    }

    this.camera.lookAt(this.scene.position);
    this.count += 0.1;
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
}
