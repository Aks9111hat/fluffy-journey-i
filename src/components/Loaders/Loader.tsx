
"use client";

import { quantum } from 'ldrs'

quantum.register()




const Loader: React.FC = () => {
    return (

        <l-quantum
            size="45"
            speed="1.75"
            color="black"
        ></l-quantum >
    );
};

export default Loader;



