import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { UpdateFormContent } from '@/action/form';
import { toast } from './ui/use-toast';
import { FaSpinner } from 'react-icons/fa';
function SaveFormBtn({id}:{id:number}) {

  const {elements} = useDesigner();
  const [loading, startTransition] = useTransition();
  const updateFormContent = async()=>{
    try {
      const JsonElements =JSON.stringify(elements);
      await UpdateFormContent(id, JsonElements);
      toast({
        title:"Success",
        description:"Your has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant:"destructive",
      });
    }
  };
  return (
    <Button variant={"outline"} className='gap-2' disabled={loading}
    onClick={()=>{
      startTransition(updateFormContent);
    }}>
      <HiSaveAs className='h-6 w-6'/>
      Save
      {loading && <FaSpinner className='animate-spin' />}
      </Button>
  );
}

export default SaveFormBtn;