// グローバル変数
let scene, camera, renderer, ambientLight, directionalLight, floor, dice;

// イニシャライザ
function init()
{
    // シーン
    scene = new THREE.Scene();

    // カメラ
    camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(4, 4, 6);

    // レンダラー
    renderer = new THREE.WebGLRenderer({
        antialias : true,
        alpha : true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // カメラを操作できるようにする
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    // カメラ操作を滑らかにする
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    document.body.appendChild(renderer.domElement);

    // 環境光
    ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // 平行光
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 5, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 3Dモデルの読み込み
    const loader = new THREE.GLTFLoader();
    
    loader.load("./models/Dice.gltf", function(gltf) {
        dice = gltf.scene;
        scene.add(dice);
    });

    // ボックスのサイズ
    const geometry = new THREE.BoxGeometry(3, 0.1, 3);
    const material = new THREE.MeshLambertMaterial(0xfafafa);
    floor = new THREE.Mesh(geometry, material);
    floor.position.set(0, -0.44, 0);
    scene.add(floor);
}



// アニメーション
function animate() 
{
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

// サイコロを振る関数
function rollDice()
{
    let number = Math.floor(Math.random() * 6 + 1);
    // console.log(number);

    // 各軸に対して回転する量
    let rx = 0, ry = 0, rz = 0;
    switch(number) {
        case 1:
            rx += Math.PI * 2;
            ry += Math.PI * 2;
            rz += Math.PI * 2;
            break;
        case 2:
            rx -= Math.PI / 2;
            ry += Math.PI * 2;
            rz += Math.PI * 2;
            break;
        case 3:
            //dice.rotation.set(0, 0, Math.PI / 2);
            rx += Math.PI * 2;
            ry += Math.PI * 2;
            rz += Math.PI / 2;
            break;
        case 4:
            //dice.rotation.set(0, 0, - Math.PI / 2);
            rx += Math.PI * 2;
            ry += Math.PI * 2;
            rz -= Math.PI / 2;
            break;
        case 5:
            //dice.rotation.set(Math.PI / 2, 0, 0);
            rx += Math.PI / 2;
            ry += Math.PI * 2;
            rz += Math.PI * 2;
            break;
        case 6:
            //dice.rotation.set(Math.PI, 0, 0);
            rx += Math.PI;
            ry += Math.PI * 2;
            rz += Math.PI * 2;
            break;
    }

    TWEEN.removeAll();

    // 回転のアニメーション
    new TWEEN.Tween(dice.rotation)
            .to(
                {
                    x: rx,
                    y: ry,
                    z: rz,
                },
                500
            )
            .start()

        new TWEEN.Tween(dice.rotation)
            .to(
                {
                    x: rx,
                    y: ry,
                    z: rz,
                },
                250
            )
            .easing(TWEEN.Easing.Linear.None)
            .start()
            .onComplete(() => {
                new TWEEN.Tween(dice.rotation)
                    .to(
                        {
                            x: rx + Math.PI * 2,
                            y: ry + Math.PI * 2,
                            z: rz + Math.PI * 2,
                        },
                        250
                    )
                    .easing(TWEEN.Easing.Linear.None)
                    .start()
            })

    // 上に跳ねるアニメーション
    new TWEEN.Tween(dice.position)
            .to(
                {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                500
            )
            .start()

        new TWEEN.Tween(dice.position)
            .to(
                {
                    x: 0,
                    y: 2,
                    z: 0,
                },
                250
            )
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
            .onComplete(() => {
                new TWEEN.Tween(dice.position)
                    .to(
                        {
                            x: 0,
                            y: 0,
                            z: 0,
                        },
                        250
                    )
                    .easing(TWEEN.Easing.Cubic.In)
                    .start()
            })
}

// ウィンドウ変更時にサイズを維持する処理
function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}

// イベント
window.addEventListener("resize", onWindowResize);
let btn = document.getElementById("roll");
btn.addEventListener("click", rollDice);

init();
animate();