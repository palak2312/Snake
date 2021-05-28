import { React, useState } from 'react'

const Temp = () => {


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    function f() {
        setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", f);

    return (
        <div>
            {windowWidth}
        </div>
    )
}

export default Temp
