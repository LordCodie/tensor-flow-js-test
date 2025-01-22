import handCalc from "./_lib/hand-calc.js"

const video = document.getElementById('webcam')
// const imageInput = document.getElementById('imageInput')
const canvas = document.getElementById('output')
const startBtn = document.getElementById('start')
const ctx = canvas.getContext('2d')
// const imgElement = new Image()

tf.env().set('WEBGL_VERSION', 1);
await tf.setBackend('wasm');
await tf.ready();
console.log('TF.js backend:', tf.getBackend()); // Should print 'webgl'

// handPoseDetection config
const model = handPoseDetection.SupportedModels.MediaPipeHands
const detectorConfig = {
    runtime: 'tfjs', // or 'tfjs',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    modelType: 'lite',
    maxHands: 1
}
const detector = await handPoseDetection.createDetector(model, detectorConfig)

function startWebCam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing webcam:', error);
        });
}

// imageInput.addEventListener('change', (event) => {
//     const file = event.target.files[0]
//     if (file) {
//         const reader = new FileReader()
//         reader.onload = (e) => {
//             imgElement.src = e.target.result
//         }
//         reader.readAsDataURL(file)
//     }
// })

// imgElement.onload = async () => {
//     canvas.width = imgElement.width;
//     canvas.height = imgElement.height;
//     ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

//     await detectHandPose();
// };

startWebCam()

startBtn.addEventListener('click', async () => {
    console.log('snap.....')

    canvas.width = video.width;
    canvas.height = video.height;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    await detectHandPose()
})

async function detectHandPose() {
    const estimationConfig = { staticImageMode: true, flipHorizontal: false }
    const hands = await detector.estimateHands(video, estimationConfig)
    const handsScore = hands[0]?.score

    const poseDB = handCalc()

    // console.log("input hands:", hands)
    // console.log("hands score:", handsScore)
    // console.log("poseDB:", poseDB)
    // console.log("filter pose:", poseDB.filter(item => item.score === hands[0].score))


    if (hands.length > 0) {
        for (const hand of hands) {
            for (const point of hand.keypoints) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            }
        }
    }

}


