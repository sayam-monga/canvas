import {useRef,useEffect} from'react';

export function useOnDraw(onDraw){
    const canvasRef= useRef(null);
    const isDrawingRef=useRef(false);
    const MouseMoveListenerRef=useRef(null)
    const MouseDownListenerRef=useRef(null)
    const MouseLiftListenerRef=useRef(null)
    const prevPointRef=useRef(null);
    useEffect(()=>{
        return()=>{
            if(MouseMoveListenerRef.current){
                
                canvasRef.current.removeEventListener("mousemove",MouseMoveListenerRef.current);
            }
            if(MouseLiftListenerRef.current){
                
                canvasRef.current.removeEventListener("mouseup",MouseLiftListenerRef.current);
            }
        }
    },[]);
    function setCanvasRef(ref){
        if(!ref) return;
        if(canvasRef.current){

            canvasRef.current.removeEventListener("mousedown",MouseDownListenerRef.current);
        }
        canvasRef.current = ref;
        initMouseMoveListener();
        initMouseDownListener();
        initMouseLiftListener();

    }
    function initMouseMoveListener(){
        const mouseMoveListener=(e)=>{
            if(isDrawingRef.current){
            // console.log({x:e.clientX,y:e.clientY});
            const point = computePointInCanvas(e.clientX,e.clientY)
            const ctx = canvasRef.current.getContext('2d');
            if(onDraw) onDraw(ctx,point,prevPointRef.current);
            prevPointRef.current=point;
            console.log(point);
            }
        }
        MouseMoveListenerRef.current=mouseMoveListener
        window.addEventListener("mousemove",mouseMoveListener);
    }
    function initMouseDownListener(){
        if(!canvasRef.current) return;
        const listener=()=>{
            isDrawingRef.current=true;
        }
        MouseDownListenerRef.current=listener
        
        canvasRef.current.addEventListener("mousedown",listener);
    }
    function initMouseLiftListener(){
        // if(!canvasRef.current) return;
        const listener=()=>{
            isDrawingRef.current=false;
            prevPointRef.current=null;
        }
        MouseLiftListenerRef.current=listener
        window.addEventListener("mouseup",listener);
        // canvasRef.current.addEventListener("mousedown",listener);
    }
    function computePointInCanvas(clientX,clientY){
        if(canvasRef.current){
        const boundingRect=canvasRef.current.getBoundingClientRect();
        return{
            x:clientX-boundingRect.left,
            y:clientY-boundingRect.top

        }}
        else{return null;}
    }
    return setCanvasRef;
}