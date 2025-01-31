import {
    Color,
    Mesh,
    PlaneGeometry,
    ShaderMaterial,
} from "three";
import BaseScene from "./BaseScene";

export default class WaveScene extends BaseScene {
    vTime = {value: 0};

    constructor() {
        super();

        this.addWave();
    }

    addWave() {
        this.geometry = new PlaneGeometry(5, 5, 50, 50);
        this.geometry.computeVertexNormals();

        this.material = new ShaderMaterial({
            uniforms: {
                time: this.vTime,
                color: {value: new Color("#a2e590")}
            },
            vertexShader: `
                #define PI 3.1415926
                #define PI2 PI*2.
                
                uniform float time;
                varying vec3 vNormal;
                
                void main(){
                    vec3 pos = position;
                    
                    float x = (length(uv - 0.5) - time) * 3. * PI2;
                    pos.z = sin(x) * 0.2;
                    
                    float cosNormal = cos(x) - 1.0;
                    
                    vNormal = vec3(cosNormal * 0.2, cosNormal * 0.2, 0.);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
                }
              `,
            fragmentShader: `
                uniform vec3 color;
                varying vec3 vNormal;
                
                void main(){
                    vec3 light = vec3(0.0, -1.0, 0.0);

                    light = normalize(light);

                    float dProd = max(0.0, dot(vNormal, light));
                    dProd += 0.5;
                    vec3 finalColor = color; 
                    finalColor *= dProd;
                
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });

        this.plane = new Mesh(this.geometry, this.material);
        this.plane.rotation.x = -Math.PI / 180 * 75;

        this.scene.add(this.plane);
    }

    update() {
        this.vTime.value += 0.005;
    }
}
