import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {MdPreview} from  "react-icons/md";
import useDesigner from './hooks/useDesigner';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElements';
import Image from 'next/image';




function PreviewDialogBtn({ selectedPosition }: { selectedPosition: string }) {
  
  const {elements} = useDesigner();
  const [profileText, setProfileText] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [footerContent, setFooterContent] = useState(localStorage.getItem('footerContent') || '');
  useEffect(() => {
    setProfileText(localStorage.getItem('text') || '');
    setProfileImage(localStorage.getItem('image') || '');
    const storedFooterContent = localStorage.getItem('footerContent');
        if (storedFooterContent) {
        setFooterContent(storedFooterContent);

        }
        // console.log(`selectedPosition in preview`, selectedPosition);
}, []);

return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant={"outline"} className='gap-2'>
      <MdPreview className='h-6 w-6' />
      Preview</Button>
    </DialogTrigger>
    <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
      <div className="px-4 py-2 border-b">
        <p className="text-lg font-bold text-muted-foreground">
          Form Preview
        </p>
      </div>
      <div className="bg-accent flex flex-col flex-grow items-center
      justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background  h-full w-full rounded-2xl
        p-8 overflow-y-auto pt-3">            
          <div className={`flex ${selectedPosition === 'left' ? 'justify-start' : selectedPosition === 'center' ? 'justify-center' : 'justify-end'}`}>
            {profileImage && 
              <div style={{ maxWidth: '30%' }}>
                <Image src={profileImage} alt="Profile" layout="responsive" width={2} height={2} />
              </div>
            }       
  
          </div>   
                 
          {
            elements.map(element =>{
              const FormComponent = FormElements[element.type].formComponent;
              return <FormComponent key={element.id} elementInstance={element} />
            })
          }
          <div className="w-full flex justify-center items-end">
            <p>{footerContent}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);


}
export default PreviewDialogBtn;