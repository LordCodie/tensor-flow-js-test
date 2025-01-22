import handpose from "../handpose.js"

const handCalc = () => {
    const scores = Object.keys(handpose).map((key) => {
        return {
            gesture: key,
            keypoints3D: handpose[key][0]?.keypoints3D || 0,
            score: handpose[key][0]?.score || 0
        }
    })
    // console.log(scores)
    return scores
}

export default handCalc