"use client";
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImShare } from 'react-icons/im';
import { toast } from './ui/use-toast';

function FormLinkShare({shareUrl}:{shareUrl:string}) {

    const [mounted, setMounted]  = useState(false);

    useEffect(()=>{
        setMounted(true);
    },
    []);

    if(!mounted){
        return null;
    }
    // const formId = generateFormId();
    const shareLink = `${window.location.origin}/submit/${shareUrl}`;
    // const shareLink = `${window.location.origin}/submit/${shareUrl}?id=${formId}`;

    // localStorage.setItem(formId, JSON.stringify(FormData));

  return (
    <div className="flex flex-grow gap-4 items-center">
        <Input value={shareLink} readOnly />
        <Button className='w-[120px]'
        onClick={()=>{
            navigator.clipboard.writeText(shareLink);
            toast({
                title: "Copied!",
                description:"Link copied to clipboard",
            });
        }}>
            <ImShare className='mr-2 h-4 w-4 ' />
            Share Link
        </Button>
    </div>
  );
}
// function generateFormId() {
//     // Generate a unique identifier for the form.
//     // This could be a simple counter or a more complex ID depending on your needs.
//     return 'form-' + Date.now();
// }
export default FormLinkShare;
