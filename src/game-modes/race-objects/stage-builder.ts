import Spline from "../../spline-objects/spline";
import Scene = THREE.Scene;
import Camera = THREE.Camera;
import Renderer = THREE.Renderer;
import {TrackObject} from "../../track-data/track-object";
import {RoadBase} from "../../spline-objects/road-base";
import {RoadSides1} from "../../spline-objects/road-sides-1";
import {RoadSides2} from "../../spline-objects/road-sides-2";
import {LandObject} from "../../spline-objects/land-object";

export class StageBuilder implements iStageBuilder {
    private materials: iHashMap = {
        roadBase: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road1.jpg" ) }),
        road1: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-side1.jpg" )}),
        road2: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/road-strip1.jpg" )}),
        ground: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/grass1.jpg" )}),
        sky: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/sky1.jpg" ), side: THREE.DoubleSide}),
        mFar: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/mountain-back1.png" ), side: THREE.DoubleSide, transparent: true}),
        mClose: new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "texture/mountain-front1.png" ), side: THREE.DoubleSide, transparent: true})
    };

    roadSpline = new Spline();
    skyPlane = null;
    mFar = null;
    mClose = null;

    public setupScene(scene: Scene, camera: Camera, renderer: Renderer, track: TrackObject) {
        camera.up = new THREE.Vector3(0,1,0);
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        track.buildRoadSpline();

        this.roadSpline = track.trackSpline;
        this.roadSpline.smoothSpline();

        new RoadBase(this.roadSpline,
            scene,
            this.materials['roadBase']);

        new RoadSides1(this.roadSpline,
            scene,
            this.materials['road1']);

        new RoadSides2(this.roadSpline,
            scene,
            this.materials['road2']);

        new LandObject(this.roadSpline,
            scene,
            this.materials['ground']);

        var skyGeometry = new THREE.PlaneGeometry( 150, 45, 1 );
        this.skyPlane = new THREE.Mesh( skyGeometry, this.materials['sky'] );
        scene.add( this.skyPlane );

        var mFarGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
        this.mFar = new THREE.Mesh( mFarGeometry, this.materials['mFar'] );
        scene.add( this.mFar );

        var mCloseGeometry = new THREE.PlaneGeometry( 150, 35, 1 );
        this.mClose = new THREE.Mesh( mCloseGeometry, this.materials['mClose'] );
        scene.add( this.mClose );

        camera.position.z = 2;
        camera.position.y = 3;
        camera.rotation.x = 0;

        scene.fog = new THREE.Fog( 0xf2f7ff, 1, 25000 );

        scene.add( new THREE.AmbientLight( 0xeef0ff ) );
    }
}

interface iHashMap {
    [name: string]: THREE.MeshPhongMaterial
}

interface iStageBuilder {
    setupScene(scene: Scene, camera: Camera, renderer: Renderer, track: TrackObject): void;
}