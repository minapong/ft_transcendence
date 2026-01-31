you can use any hooks by importing in this way

example page : index.tsx

import {useState,useEffect,useMemo,useRef} from "Reactor"

function example(){
    const [state,setState]=useState(0);
    return(
        <div onClick={()=>setState(state+1)} >{state}</div>
    );
}

in useState() function useState can take both callback function and variable as well like

setState(()=>state+1) or setState("hashir") 


