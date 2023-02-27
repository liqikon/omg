import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

/**
 * Debug
 */
// const gui = new dat.GUI()

// const parameters = {
//     materialColor: '#ffeded'
// }

// gui
// .addColor(parameters, 'materialColor')
// .onChange(()=>
// {
//     material.color.set(parameters.materialColor)
// })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

/**
 * particles
 */
// const particlesCount = 200
// const positions = new Float32Array(particlesCount*3)
// for(let i=0; i <particlesCount; i++){
//     positions[i * 3 + 0] = (Math.random() - 0.5) * 10
//     positions[i * 3 + 1] =  Math.random() * 50
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 10
// }
// const particlesGeometry = new THREE.BufferGeometry()
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// const particlesMaterial = new THREE.PointsMaterial({
//     color: '#ffffff',
//     sizeAttenuation: true,
//     size:0.03
// })
// //
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)
/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let mesh = null;

gltfLoader.load(
    '/3d/model.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.02,0.02,0.02)
        scene.add(gltf.scene)
        console.log(scene.children);
        mesh = scene.children[2];
       
        updateAllMaterials()
    

  }

)

const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        // if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        // {
        //     // child.material.envMap = environmentMap
        //     child.material.envMapIntensity = debugObject.envMapIntensity
        //     child.castShadow = true
        //     child.receiveShadow = true
        // }
        child.material = material

    })
}
// // //Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/metal_03.png');
gradientTexture.magFilter = THREE.NearestFilter
// //Material
const material = new THREE.MeshBasicMaterial({
    // color:'#333333',
    gradientMap: gradientTexture,
    // const materials = [
    //     new THREE.MeshBasicMaterial({ map: loader.load("flower-1.jpg") }),
    //     new THREE.MeshBasicMaterial({ map: loader.load("flower-2.jpg") }),
    //     new THREE.MeshBasicMaterial({ map: loader.load("flower-3.jpg") }),
    //     new THREE.MeshBasicMaterial({ map: loader.load("flower-4.jpg") }),
    //     new THREE.MeshBasicMaterial({ map: loader.load("flower-5.jpg") }),
    //     new THREE.MeshBasicMaterial({ map: loader.load("flower-6.jpg") }),
    // ];
    map: textureLoader.load('textures/gradients/metal_03.png')
});

// //Mesh
// // const objectsDistance = 4
// const mesh = new THREE.Mesh(gltf.asset,
//     material
// )
// const mesh2 = new THREE.Mesh(
//     new THREE.ConeGeometry(1,2,32),
//     material
// )
// const mesh3 = new THREE.Mesh(
//     new THREE.TorusKnotGeometry(0.8,0.35,100,16),
//     material
//     )
//     mesh1.position.y = -objectsDistance *0;
//     mesh2.position.y = -objectsDistance *1;
//     mesh3.position.y = -objectsDistance *2;


// scene.add(mesh)
// const sectionMeshes = [ mesh1, mesh2, mesh3 ]
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#000000',1)
directionalLight.position.set(1,1,1)
scene.add(directionalLight)
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.normalBias = 0.05
// directionalLight.position.set(0.25, 3, - 2.25)
// scene.add(directionalLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * scroll
 */
let scrollY = window.scrollY
window.addEventListener('scroll',()=>{
    scrollY = window.scrollY
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)
    // //Animate camera
//    camera.rotation.y = scrollY *0.012

    //Animate meshes
    // for(const mesh of sectionMeshes){
    //     mesh.rotation.x = elapsedTime *0.1
    //     mesh.rotation.y = elapsedTime *0.12

    // }

    //OMG
    if(mesh!==null){
        mesh.rotation.x = scrollY * 0.005;
        mesh.rotation.y = -(scrollY * 0.005)
    }
    // mesh1.rotation.y = scrollY * 0.005

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()