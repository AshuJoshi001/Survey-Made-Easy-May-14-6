"use client";
import React, { useState, useEffect } from 'react';
import DesignerSidebar from './DesignerSidebar';
import {DragEndEvent, useDndMonitor, useDraggable, useDroppable} from "@dnd-kit/core";
import { cn } from '@/lib/utils';
import useDesigner from './hooks/useDesigner';
import { ElementsType, FormElementInstance, FormElements } from './FormElements';
import { idGenerator } from '@/lib/idGenerator';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';
import Image from 'next/image';

interface DesignerProps {
    setPosition: React.Dispatch<React.SetStateAction<string>>;
  }

const positions = ['left', 'center', 'right'];

  function Designer({ setPosition }: DesignerProps) {
// function Designer({ updateImagePosition }: { updateImagePosition: (position: Position) => void }) {     
    const {elements, addElement, selectedElement, setSelectedElement, removeElement} = useDesigner();
    const droppable = useDroppable({
        id:"designer-drop-area",
        data:{
            isDesignerDropArea:true,
        },
    });

    
    const [profileText, setProfileText] = useState('');
    const [profileImage, setProfileImage] = useState('');    
    // const designerContainerSize = { width: 920, height: 200 }; // Size of the designer container
    const [footerContent, setFooterContent] = useState(localStorage.getItem('footerContent') || '');
    
    
    const [selectedPosition, setSelectedPosition] = useState('left');
    
    useEffect(() => {
        setProfileText(localStorage.getItem('text') || '');
        setProfileImage(localStorage.getItem('image') || '');
        const storedFooterContent = localStorage.getItem('footerContent');
        if (storedFooterContent) {
        setFooterContent(storedFooterContent);
        }
        // Get all EmailFields from the elements array
        const emailFields = elements.filter(el => el.type === "EmailField");
    
        // If an EmailField does not exist, add one
        if (emailFields.length === 0) {
            const emailField = FormElements["EmailField"].construct(idGenerator());
            addElement(elements.length, emailField);
        }
    
        // If more than one EmailField exists, remove the extras
        else if (emailFields.length > 1) {
            // Keep the first EmailField and remove the rest
            emailFields.slice(1).forEach(extraEmailField => {
                removeElement(extraEmailField.id);
            });
        }
    }, [elements, addElement, removeElement]);
    useDndMonitor({
        onDragEnd:(event:DragEndEvent)=>{
            const {active, over} = event;
            if(!active || !over) return;

            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

            // first scenario: dropping a sidebar btn element over the designer drop area

            const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;
            if(droppingSidebarBtnOverDesignerDropArea){
                
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()                   
                );
                addElement(elements.length,newElement);  
                return;             
            }


            const isDroppingOverDesignerElementTopHalf = 
            over.data?.current?.isTopHalfDesignerElement;

            const isDroppingOverDesignerElementBottomHalf = 
            over.data?.current?.isBottomHalfDesignerElement;

            const isDroppingOverDesignerElement = 
            isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;

            const droppingSidebarBtnOverDesignerElement  = isDesignerBtnElement && isDroppingOverDesignerElement;
          
            //Second Scenario:
            if(droppingSidebarBtnOverDesignerElement){
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()                   
                );

                const overId = over.data?.current?.elementId;
                const overElementIndex = elements.findIndex((el)=> el.id === overId) ;

                if(overElementIndex === -1){
                    throw new Error("Element not found");
                }

                let indexForNewElement = overElementIndex;

                if(isDroppingOverDesignerElementBottomHalf){
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement,newElement);  
                return; 
            }

            // Third scenario

            const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

            const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement ;
        
            if(draggingDesignerElementOverAnotherDesignerElement){
                const activeId = active.data?.current?.elementId;
                const overId = over.data?.current?.elementId;

                const activeElementIndex = elements.findIndex((el)=>el.id===activeId);
                const overElementIndex = elements.findIndex((el)=>el.id===overId);

                if(activeElementIndex=== -1 || overElementIndex=== -1){
                    throw new Error("Element not found");
                }

                const activeElement = {...elements[activeElementIndex]};
                removeElement(activeId);


                let indexForNewElement = overElementIndex;

                if(isDroppingOverDesignerElementBottomHalf){
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, activeElement);
            }        
        },

    });

  return (
    <div className='flex w-full h-full'>
        <div className="p-4 w-full" 
        onClick={()=>{
            if(selectedElement) setSelectedElement(null);
        }}>
            <div 
                ref={droppable.setNodeRef}
                className={cn(
                "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-start justify-start flex-1 overflow-y-auto",
                droppable.isOver && "ring-4 ring-primary ring-inset")}
            >
               <div className="grid grid-cols-3">
            {positions.map((position, index) => (
              <div key={index} className={`col-span-1 pt-[23px] ml-10 mr-10 text-${position}`}
                onClick={() => {
                  setSelectedPosition(position);
                  setPosition(position);
                  console.log('position',position);
                  
                  
                }}>
                {profileImage && position === selectedPosition && 
                    <div className="min-w-[50px] min-h-[50px]">
                        <Image src={profileImage} alt="Profile" layout="responsive" width={1} height={1} />
                    </div>
                }
              </div>
            ))}
          
          </div>

                {!droppable.isOver && elements.length === 0 && (
                <div className='text-3xl text-muted-foreground flex flex-grow items-center font-bold pl-[333px]'>
                    <p>Drop Here</p>
                </div>
                )}

                {droppable.isOver && elements.length===0 &&(
                    <div className="p-4 w-full">
                        <div className="h-[120px] rounded-md bg-primary/20"></div>
                    </div>
                )}
                {elements.length >0 && (
                    <div className="flex flex-col w-full gap-2 p-4">
                        {elements.map((element)=>(
                            <DesignerElementWrapper key={element.id} element={element}/>
                        ))}
                    </div>
                )}
                <div className="w-full flex justify-center items-end ">
                    <p>{footerContent}</p>
                </div>
            </div>
        </div>
        <DesignerSidebar/>
    </div>
  );
}

function DesignerElementWrapper({element}:{element:FormElementInstance}){

    const{removeElement, selectedElement, setSelectedElement} = useDesigner();
    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

    
    const topHalf = useDroppable({
        id:element.id + "-top",
        data:{
            type:element.type,
            elementId:element.id,
            isTopHalfDesignerElement:true,
        },
    });

    const bottomHalf = useDroppable({
        id:element.id + "-bottom",
        data:{
            type:element.type,
            elementId:element.id,
            isBottomHalfDesignerElement:true,
        },
    });


    const draggable = useDraggable({
        id:element.id + "-drag-handler",
        data:{
            type:element.type,
            elementId:element.id,
            isDesignerElement:true,
        },
    });

    if(draggable.isDragging) return null;

    console.log("SELECTED ELEMENT",selectedElement);
    
    const DesignerElement = FormElements[element.type].designerComponent;
    return (
        <div 
        ref={draggable.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
         className="relative h-[120px] flex flex-col text-foreground
        hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
        onMouseEnter={()=>{
            setMouseIsOver(true);
        }}

        onMouseLeave={()=>{
            setMouseIsOver(false);
        }}

        onClick={(e)=>{
            e.stopPropagation();
            setSelectedElement(element);
        }}
        >
        <div ref={topHalf.setNodeRef} 
        className="absolute w-full h-1/2 rounded-t-md"
        />
        <div ref={bottomHalf.setNodeRef} 
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
        />
        {mouseIsOver && (
                <>
                    <div className="absolute right-0 h-full">
                        {/* Disable the delete button for the email field */}
                        {element.type !== "EmailField" && (
                            <Button className='flex justify-center h-full border rounded-md
                            rounded-l-none bg-red-500'
                            variant={"outline"}
                            onClick={(e)=>{
                                e.stopPropagation();
                                removeElement(element.id);
                            }}
                            >
                                <BiSolidTrash className='h-6 w-6'/>
                            </Button>
                        )}
                    </div>
                 
                </>
            )
        }

        {topHalf.isOver && (
            <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"/>
        )}

        <div 
        className={cn(
            "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-4 pointer-events-none opacity-100",
        mouseIsOver && "opacity-30")}
        >
        <DesignerElement elementInstance={element}/>
        </div>

        {bottomHalf.isOver && (
            <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none"/>
        )}
        
        </div>
        
    );

}

export default Designer;