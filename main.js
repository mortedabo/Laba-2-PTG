// ссылка на блок веб-страницы, в котором будет отображаться графика
var container;

// переменные: камера, сцена и отрисовщик
var camera, scene, renderer;

var loader = new THREE.TextureLoader();

var keyboard = new THREEx.KeyboardState();

var planets = [];

var follow = 0;

var switchspeed = 3.0;
var rotationspeed = 1.0;

var ang = 0.0;

var cameraDefaultPosition = new THREE.Vector3(0, 100, 0);
var cameraDefaultLook = new THREE.Vector3(0, 0, 0);
var cameraCurrentLook = new THREE.Vector3(0, 0, 0);

var clock = new THREE.clock();
// функция инициализации камеры, отрисовщика, объектов сцены и т.д.
init();

// обновление данных по таймеру браузера
animate();

// в этой функции можно добавлять объекты и выполнять их первичную настройку
function init() 
{
    // получение ссылки на блок html-страницы
    container = document.getElementById('container');
    // создание сцены
    scene = new THREE.Scene();

    // установка параметров камеры
    // 45 - угол обзора
    // window.innerWidth / window.innerHeight - соотношение сторон
    // 1 и 4000 - ближняя и дальняя плоскости отсечения
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);    

    // установка позиции камеры
    camera.position.set(0, 100, 0);
    
    // установка точки, на которую камера будет смотреть
    camera.lookAt(new THREE.Vector3(0, 0.0, 0));  
     // создание отрисовщика
     renderer = new THREE.WebGLRenderer( { antialias: false } );
     renderer.setSize(window.innerWidth, window.innerHeight);
     // закрашивание экрана синим цветом, заданным в шестнадцатеричной системе
     renderer.setClearColor(0xffffffff, 1);
 
     container.appendChild(renderer.domElement);
 
     // добавление обработчика события изменения размеров окна
     window.addEventListener('resize', onWindowResize, false);




    var spotlight = new three.pointlight(0xffffff);
    spotlight.position.set(0,0,0);

    scene.add(spotlight);
    var light = new THREE.AmbientLight( 0x202020 );
    scene.add( light )


    create_object("planets\sunmap.jpg", 7);
    create_object("planets\starmap.jpg", 500);


    create_object("planets\mercury\mercurymap.jpg", 1, 10, 2, 2);
    create_object("planets\venus\venusmap.jpg", 2, 20, 1.5, 1.5);
    create_object("planets\earth\earthmap1k.jpg", 3, 30, 1, 1);
    create_object("planets\mars\marsmap1k.jpg", 2.5, 40, 0.8, 0.8);
    



}





function create_planet(texture_name, raius, distance, a1, a2)

{
    var geometry = new three.SphereGeometry ( radius, 32, 32 );

    var tex =loader.load( texture_name );

    tex.minFilter = THREE.NearestFilter;


            // создание материала
        var material = new THREE.MeshLambertMaterial({
            map: tex,
            side: THREE.DoubleSide
        });



    var sphere = new THREE.Mesh ( geometry, material);
    sphere.position.set(distance, 0, 0);
    scene.add(sphere);
    var planet = {};
    planet.model = sphere;
    planet.orbit = distance;
    planet.s1 = a1;
    planet.a1 = 0.0;
    planet.s2 = a2;
    planet.a2 = 0.0;
    planet.r = radius;

    planets.push(planet);

}

 function create_object(texture_name, radius)
{
   // создание геометрии для сферы	
var geometry = new THREE.SphereGeometry(radius, 32, 32);

// загрузка текстуры
var tex = loader.load("imgs/sunmap.jpg");
tex.minFilter = THREE.NearestFilter;

// создание материала
var material = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.DoubleSide
});

// создание объекта
var sphere = new THREE.Mesh(geometry, material);

// размещение объекта в сцене
scene.add(sphere);


}
 function onWindowResize() 
 {
     // изменение соотношения сторон для виртуальной камеры
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     // изменение соотношения сторон рендера
     renderer.setSize(window.innerWidth, window.innerHeight);
 }
 
 // в этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate() 
{

    var delta = clock.getDelta();

    for (var i = 0; i < planets.legth; i++)
    {
        // создание набора матриц
        var m = new THREE.Matrix4();
        var m1 = new THREE.Matrix4();
        var m2 = new THREE.Matrix4();

        planets[i].a1 += planets[i].s1 * delta;
        planets[i].a2 += planets[i].s2 * delta;

        // создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2           
        m1.makeRotationY(planets[i].a1);
        m2.setPosition(new THREE.Vector3(planets[i].orbit, 0, 0));

        // запись результата перемножения m1 и m2 в m           
        m.multiplyMatrices(m1, m2);
        m1.makeRotationY(planets[i].a2);
        m.multiplyMatrices(m, m1);


                    
        planets[i].model.matrix = m;
        planets[i].model.matrixAutoUpdate = false;




    }


    keys(delta);
    requestAnimationFrame( animate );
    render ();


      
}

function render() 
{
    // рисование кадра
    renderer.render(scene, camera);
}

function keys(delta) 

{

           if (keyboard.pressed("1"))
            {
                follow = 1;
                rotationspeed = 1.0;
                switchspeed = 3.0;
            }

            if (keyboard.pressed("2"))
                {
                    follow = 2;
                    rotationspeed = 1.0;
                    switchspeed = 3.0;
                }

                if (keyboard.pressed("3"))
                    {
                        follow = 3;
                        rotationspeed = 1.0;
                        switchspeed = 3.0;
                    }
                
                    if (keyboard.pressed("4"))
                        {
                            follow = 4;
                            rotationspeed = 1.0;
                            switchspeed = 3.0;
                        }



            if (keyboard.pressed("0"))
                {
                    follow = 0;
                    rotationspeed = 1.0;
                    switchspeed = 3.0;
                }

            if (keyboard.pressed('right'))
            {
                ang += Math.PI/5 * delta;

            }

            if (keyboard.pressed('left'))
                {
                    ang -= Math.PI/5 * delta;

                }
 
            if (follow == 0)
                {
                
                    camera.position.lerp(cameraDefaultPosition, delta * switchspeed);
                    //camera.lookAt.lerp(cameraDefaultLook, delta * switchspeed);

                                                
                  cameraCurrentLook.lerp(cameraDefaultLook, delta * rotationspeed);
    
                   // установка точки, на которую камера будет см
                  camera.lookAt(cameraCurrentLook);  
                }



            if (follow > 0)
            {

                var planet = planets[follow-1];
                if (planet !=null)
                {

                    if (rotationspeed < 100) rotationspeed += delta * 2.0;
                    if (switchspeed < 100) switchspeed += delta * 2.0;


                // получение матрицы позиции из матрицы объекта 
    var m = new THREE.Matrix4();
    m.copyPosition(planet.model.matrix);
    
    // получение позиции из матрицы позиции
    var pos = new THREE.Vector3(0, 0, 0);
    pos.setFromMatrixPosition(m);
    
    var cpos = new THREE.vector3(0,0,0);
    cpos.x = pos.x + (planet.r*4) * Math.cos(ang + -planet.a1);
    cpos.z = pos.z + (planet.r*4) * Math.sin(ang + -planet.a1);
    
    cpos.y = 5;
    
            // установка позиции камеры
    //camera.position.copy(cpos);
    camera.position.lerp(cpos, delta * switchspped);
    cameraCurrentLook.lerp(pos, delta * rotationspeed);
    // установка точки, на которую камера будет смотреть
    camera.lookAt(meraCurrentLook);
     
                }
        }
            }






    
























