// BASIC SETUP
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
scene.fog = new THREE.Fog(0x111111,10,80)

const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000)
camera.position.set(0,1.6,5)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth,innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// LIGHT
scene.add(new THREE.AmbientLight(0x404040,1.2))
const sun = new THREE.DirectionalLight(0xffffff,1)
sun.position.set(10,20,10)
sun.castShadow = true
scene.add(sun)

// FLOOR
const floor = new THREE.Mesh(
 new THREE.PlaneGeometry(200,200),
 new THREE.MeshStandardMaterial({color:0x444444})
)
floor.rotation.x = -Math.PI/2
floor.receiveShadow = true
scene.add(floor)

// WALLS
function wall(x,z,w,h){
 const m=new THREE.Mesh(
  new THREE.BoxGeometry(w,4,h),
  new THREE.MeshStandardMaterial({color:0x666666})
 )
 m.position.set(x,2,z)
 m.castShadow = m.receiveShadow = true
 scene.add(m)
}
wall(5,0,2,10)
wall(-5,3,8,2)

// PLAYER
let hp = 100
let vel = 0
document.addEventListener("keydown",e=>{
 if(e.key==="w") vel=0.1
})
document.addEventListener("keyup",()=>vel=0)

// BOT
const bots=[]
function spawnBot(x,z){
 const b=new THREE.Mesh(
  new THREE.BoxGeometry(1,2,1),
  new THREE.MeshStandardMaterial({color:0xaa3333})
 )
 b.position.set(x,1,z)
 b.hp=100
 scene.add(b)
 bots.push(b)
}
spawnBot(10,10)

// RADAR
const radar=document.getElementById("radar")
const rctx=radar.getContext("2d")

function drawRadar(){
 rctx.clearRect(0,0,150,150)
 rctx.fillStyle="lime"
 rctx.fillRect(75+camera.position.x*2,75+camera.position.z*2,4,4)
 rctx.fillStyle="red"
 bots.forEach(b=>{
  rctx.fillRect(75+b.position.x*2,75+b.position.z*2,4,4)
 })
}

// LOOP
function loop(){
 camera.position.z -= vel
 bots.forEach(b=>{
  if(b.position.distanceTo(camera.position)<15){
   hp -= 0.05
  }
 })
 document.getElementById("hud").textContent="HP: "+Math.floor(hp)
 drawRadar()
 renderer.render(scene,camera)
 requestAnimationFrame(loop)
}
loop()
