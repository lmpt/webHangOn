import Vector3 = THREE.Vector3;
import '../../node_modules/mousetrap/mousetrap.min.js';
import {StageBuilder} from "./race-objects/stage-builder";
import TestTrack from "../track-data/test-track";
import PositionHandler from "./race-objects/position-handler";

export default class Race {
    renderer = new THREE.WebGLRenderer({antialias: true});
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 30 );
    currentSpeed = 0;
    roadSpline = null;
    cameraPosition = null;
    player: iPlayer = {
        object: new THREE.Mesh( new THREE.BoxGeometry(.7, 1, 1 ), new THREE.MeshPhongMaterial( { color: 0xeeeeee }) ),
        offset: new THREE.Vector3(0, -1.52, -3.5),
        zClamp: 0.5,
        xSpeed: 0,
        xStep: 0.005,
        xClamp: 0.1,
        roadClamp: 6
    };
    input: iInput = {
        steer: null,
        gas: false,
        brake: false,
        turbo: false
    };

    stageBuilder = new StageBuilder();
    track = new TestTrack();
    positionHandler = new PositionHandler();

    setup() {
        let loader = new THREE.JSONLoader();

        loader.load('bike/bike.js', (geometry) => {
            // create a new material
            var material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture( "bike/bike_d.jpg" ) })

            // create a mesh with models geometry and material
            var mesh = new THREE.Mesh(
                geometry,
                material
            );

            mesh.rotation.y = -Math.PI/1;
            mesh.scale.x = 0.4;
            mesh.scale.y = 0.4;
            mesh.scale.z = 0.4;

            this.player.object = mesh;

            this.scene.add(this.player.object);
        });

        Mousetrap.reset();

        this.stageBuilder.setupScene(this.scene, this.camera, this.renderer, this.track);
        this.positionHandler.skyPlane = this.stageBuilder.skyPlane;
        this.positionHandler.mFar = this.stageBuilder.mFar;
        this.positionHandler.mClose = this.stageBuilder.mClose;
        this.positionHandler.roadSpline = this.stageBuilder.roadSpline.getVectors();
        this.positionHandler.deafultZ = this.track.defaultZ;



        Mousetrap.bind('left', () => { this.input.steer = "left"; });
        Mousetrap.bind('left', () => { if(this.input.steer == "left") {this.input.steer = null;} }, 'keyup');
        Mousetrap.bind('right', () => { this.input.steer = "right"; });
        Mousetrap.bind('right', () => { if(this.input.steer == "right") {this.input.steer = null;} }, 'keyup');
        Mousetrap.bind('space', () => { this.input.gas = true; });
        Mousetrap.bind('space', () => { this.input.gas = false; }, 'keyup');
        Mousetrap.bind('a', () => { this.input.brake = true; });
        Mousetrap.bind('a', () => { this.input.brake = false; }, 'keyup');
        Mousetrap.bind('s', () => { this.input.turbo = true; });
        Mousetrap.bind('s', () => { this.input.turbo = false; }, 'keyup');
    }

    loop() {
        if(this.input.gas) {
            this.currentSpeed += 0.005;
        } else if(this.currentSpeed > 0.005) {
            this.currentSpeed -= 0.005;
        }

        if(this.input.steer == "left") {
            this.player.xSpeed += (this.player.xStep * this.currentSpeed);
        } else if(this.input.steer == "right") {
            this.player.xSpeed -= (this.player.xStep * this.currentSpeed);
        } else {
            if (this.player.xSpeed > 0.01) {
                this.player.xSpeed -= this.player.xStep;
            } else if(this.player.xSpeed < -0.01) {
                this.player.xSpeed += this.player.xStep;
            } else {
                this.player.xSpeed = 0;
            }
        }

        this.player.object.rotation.z = -(this.player.xSpeed * 5);

        this.player.xSpeed = this.clamp(this.player.xSpeed, -this.player.xClamp, this.player.xClamp);

        this.currentSpeed = this.clamp(this.currentSpeed, 0, this.player.zClamp);

        this.player.offset.x -= this.player.xSpeed;

        this.positionHandler.currentSpeed = this.currentSpeed;

        this.positionHandler.updatePositions(this.player.offset.x);

        this.cameraPosition = this.positionHandler.player.transform;

        this.player.offset.x = this.clamp(this.player.offset.x, -this.player.roadClamp, this.player.roadClamp);

        if((this.player.offset.x - this.positionHandler.xdiffFromSpline > 4 || this.player.offset.x - this.positionHandler.xdiffFromSpline < -4)) {
            console.log("crash");
        }

        this.player.object.position.x = this.positionHandler.player.transform.x + this.player.offset.x;
        this.player.object.position.y = this.positionHandler.getPlayerRoadYOffset() + .1;
        this.player.object.position.z = this.positionHandler.player.transform.z + this.player.offset.z;

        this.camera.position.x = this.cameraPosition.x + this.player.offset.x;
        this.camera.position.y = this.cameraPosition.y;
        this.camera.position.z = this.cameraPosition.z;

        this.renderer.render(this.scene, this.camera);
    }

    private clamp(number: number, min: number, max: number): number {
        return Math.min(Math.max(number, min), max);
    }
}

interface iPlayer {
    object: THREE.Mesh;
    offset: Vector3;
    zClamp: number;
    xSpeed: number;
    xStep: number;
    xClamp: number;
    roadClamp: number;
}

interface iInput {
    steer: string;
    gas: boolean;
    brake: boolean;
    turbo: boolean;
}