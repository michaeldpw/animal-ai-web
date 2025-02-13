import {Component, OnDestroy, OnInit} from '@angular/core';
import * as THREE from "three";
// import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {fromEvent, Observable, Subscription} from "rxjs";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

// @HostListener('window:resize', ['$event'])
// onResize(event) {
//   event.target.innerWidth;
// }
export class HomeComponent implements OnInit, OnDestroy {
  container: HTMLElement | null | undefined;

  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  clock: any;
  controls: THREE.Controls<any> | any;
  nucleus: any;
  sphereBg: THREE.Mesh | undefined;
  stars: any;
  cameraSpeed = 0;
  blobScale = 3;
  delta = 0;
  // noise = new SimplexNoise();

  timeout_Debounce: any;

  resizeObservable$: Observable<Event> | undefined;
  resizeSubscription$: Subscription | undefined;

  currentUser: any;

  constructor(userService: UserService) {
    userService.userObservable.subscribe(u => {
      console.log(u);
      this.currentUser = u;

    })
  }

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      console.log('event: ', evt)
      clearTimeout(this.timeout_Debounce);
      this.timeout_Debounce = setTimeout(this.onWindowResize, 80);
    })
    this.container = document.getElementById("canvas_container");
    console.log(this.container);
    // this.initCanvas();
    // this.limitFPS(1 / 60);
  }

   onWindowResize() {
    if (this.camera && this.container && this.renderer) {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

  }


  initCanvas():void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000)
    this.camera.position.set(0,0,230);

    const directionalLight = new THREE.DirectionalLight("#fff", 1);
    directionalLight.position.set(0, 50, -20);
    this.scene.add(directionalLight);

    let ambientLight = new THREE.AmbientLight("#ffffff", 1);
    ambientLight.position.set(0, 20, 20);
    this.scene.add(ambientLight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    if (this.container) {
      console.log(this.container);
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);
    }


    this.clock = new THREE.Clock();

    //OrbitControl
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 4;
    this.controls.maxDistance = 350;
    this.controls.minDistance = 150;
    this.controls.enablePan = false;

    const loader = new THREE.TextureLoader();
    const textureSphereBg = loader.load('https://i.ibb.co/HC0vxMw/sky2.jpg');
    const texturenucleus = loader.load('https://i.ibb.co/hcN2qXk/star-nc8wkw.jpg');
    const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
    const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");
    const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
    const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");


    /*  Nucleus  */
    // texturenucleus.anisotropy = 16;
    // let icosahedronGeometry = new THREE.IcosahedronGeometry(30, 10);
    // let lambertMaterial = new THREE.MeshPhongMaterial({ map: texturenucleus });
    // this.nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    // this.scene.add(this.nucleus);


    /*    Sphere  Background   */
    textureSphereBg.anisotropy = 16;
    let geometrySphereBg = new THREE.SphereGeometry(150, 40, 40);
    let materialSphereBg = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: textureSphereBg,
    });
    this.sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
    this.scene.add(this.sphereBg);


    /*    Moving Stars   */
    let starsGeometry = new THREE.BufferGeometry();
    const vertices1 = [];
    for (let i = 0; i < 50; i++) {
      let theta = 2 * Math.PI * Math.random();
      let phi = Math.acos(2 * Math.random() - 1);
      let dx = 0 + (150 * Math.sin(phi) * Math.cos(theta));
      let dy = 0 + (150 * Math.sin(phi) * Math.sin(theta));
      let dz = 0 + (150 * Math.cos(phi));
      // let particleStar = this.randomPointSphere(150);

      //       particleStar.velocity = THREE.MathUtils.randInt(50, 200);
      //
      //       particleStar.startX = particleStar.x;
      //       particleStar.startY = particleStar.y;
      //       particleStar.startZ = particleStar.z;
      vertices1.push(dx, dy, dz, THREE.MathUtils.randFloat(50, 200));
    }
    console.log("v1", vertices1);
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices1, 4));
    console.log("starsgeometry", starsGeometry.getAttribute('position'));

    let starsMaterial = new THREE.PointsMaterial({
      size: 5,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
      map: textureStar,
      blending: THREE.AdditiveBlending,
    });
    starsMaterial.depthWrite = false;
    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    console.log(this.stars)
    // this.scene.add(this.stars);
    this.scene.add(this.createStars(texture1, 15, 20));
    this.scene.add(this.createStars(texture2, 5, 5));
    this.scene.add(this.createStars(texture4, 7, 5));
  }

  randomPointSphere (radius: any): any {
    let theta = 2 * Math.PI * Math.random();
    let phi = Math.acos(2 * Math.random() - 1);
    let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
    let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
    let dz = 0 + (radius * Math.cos(phi));
    return new THREE.Vector3(dx, dy, dz);
  }

  /*    Fixed Stars   */
  createStars(texture: any, size: number, total: number) {
    let pointGeometry = new THREE.BufferGeometry();
    let pointMaterial = new THREE.PointsMaterial({
      size: size,
      map: texture,
      blending: THREE.AdditiveBlending,
    });

    const vertices = [];
    for (let i = 0; i < total; i++) {
      let radius = THREE.MathUtils.randInt(149, 70);
      // let particles = this.randomPointSphere(radius);
      let theta = 2 * Math.PI * Math.random();
      let phi = Math.acos(2 * Math.random() - 1);
      let dx = 0 + (radius * Math.sin(phi) * Math.cos(theta));
      let dy = 0 + (radius * Math.sin(phi) * Math.sin(theta));
      let dz = 0 + (radius * Math.cos(phi));
      vertices.push(dx, dy, dz);
    }
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return new THREE.Points(pointGeometry, pointMaterial);
  }


  // Caps the rendering loop to a specified frame interval
  limitFPS(interval: any) {
    requestAnimationFrame(this.limitFPS.bind(this, interval));
    this.delta += this.clock.getDelta();

    if (this.delta > interval) {
      this.animate();
      this.delta = this.delta % interval;
    }
  }

  animate() {
    //  console.log(this.nucleus.geometry);

    this.stars.geometry.attributes.position.array.forEach((v: any, index: number) => {
      if (!isNaN(this.stars.geometry.attributes.position.array[index])) {
        const starX = JSON.parse(JSON.stringify(this.stars.geometry.attributes.position.array[index]));
        const starY = JSON.parse(JSON.stringify(this.stars.geometry.attributes.position.array[index + 1]));
        const starZ = JSON.parse(JSON.stringify(this.stars.geometry.attributes.position.array[index + 2]));
        this.stars.geometry.attributes.position.array[index] += (0 - this.stars.geometry.attributes.position.array[index]) / this.stars.geometry.attributes.position.array[index + 3];
        this.stars.geometry.attributes.position.array[index + 1] += (0 - this.stars.geometry.attributes.position.array[index + 1]) / this.stars.geometry.attributes.position.array[index + 3];
        this.stars.geometry.attributes.position.array[index + 2] += (0 - this.stars.geometry.attributes.position.array[index + 2]) / this.stars.geometry.attributes.position.array[index + 3];

        this.stars.geometry.attributes.position.array[index + 3] -= 0.3;

        if  (this.stars.geometry.attributes.position.array[index] <= 5 &&  this.stars.geometry.attributes.position.array[index] >= -5 &&  this.stars.geometry.attributes.position.array[index + 2] <= 5 &&  this.stars.geometry.attributes.position.array[index + 2] >= -5) {
          this.stars.geometry.attributes.position.array[index] = starX;
          this.stars.geometry.attributes.position.array[index + 1] = starY;
          this.stars.geometry.attributes.position.array[index + 2] = starZ;
          this.stars.geometry.attributes.position.array[index + 3] = THREE.MathUtils.randInt(50, 300);
        }
      }


    })

    // if (this.stars.geometry.attributes.position) {
    //   //Stars  Animation
    //   this.stars.geometry.attributes.position.array?.forEach(function (v: any) {
    //     v.x += (0 - v.x) / v.velocity;
    //     v.y += (0 - v.y) / v.velocity;
    //     v.z += (0 - v.z) / v.velocity;
    //
    //     v.velocity -= 0.3;
    //
    //     if (v.x <= 5 && v.x >= -5 && v.z <= 5 && v.z >= -5) {
    //       v.x = v.startX;
    //       v.y = v.startY;
    //       v.z = v.startZ;
    //       v.velocity = THREE.MathUtils.randInt(50, 300);
    //     }
    //   });
    // }

    // if (this.stars.geometry.vertices) {
    //   //Nucleus Animation
    //   this.nucleus.geometry.vertices?.forEach((v: any) => {
    //     let time = Date.now();
    //     v.normalize();
    //     let distance = this.nucleus.geometry.parameters.radius + this.noise.noise3d(
    //       v.x + time * 0.0005,
    //       v.y + time * 0.0003,
    //       v.z + time * 0.0008
    //     ) * this.blobScale;
    //     v.multiplyScalar(distance);
    //   })
    // }



    // this.nucleus.geometry.verticesNeedUpdate = true;
    // this.nucleus.geometry.normalsNeedUpdate = true;
    // this.nucleus.geometry.computeVertexNormals();
    // this.nucleus.geometry.computeFaceNormals();
    // this.nucleus.rotation.y += 0.002;


    //Sphere Background Animation
    if (this.sphereBg) {
      this.sphereBg.rotation.x += 0.001;
      this.sphereBg.rotation.y += 0.001;
      this.sphereBg.rotation.z += 0.001;
    }



    this.controls.update();
    this.stars.geometry.verticesNeedUpdate = true;
    // console.log(this.renderer && this.scene && this.camera)
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe()

    }
  }


}
