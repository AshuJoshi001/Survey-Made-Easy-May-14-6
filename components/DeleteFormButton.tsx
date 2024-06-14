"use client";

import { useState } from 'react';
import { DeleteForm } from "@/action/form";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Form } from "@prisma/client";


export default function DeleteFormButton({ form }: { form: Form }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await DeleteForm(form.id);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete form', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setIsChecked(false);  //Reset the checkbox state
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);  //Toggle the checkbox state
  };

  const ConfirmationDialog = () => (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
       <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
             <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
               Delete Form
             </h3>
             <div className="mt-2">
               <p className="text-sm text-gray-500">
                 Are you sure you want to delete this form?
               </p>
               {form.published && (
                 <div className="mt-4">
                   <label className="flex items-center">
                     <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                     <span className="ml-2">If you delete this form, your form submission will also be deleted.</span>
                   </label>
                 </div>
               )}
             </div>
           </div>
           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
             <button type="button" className={`mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${form.published && !isChecked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`} onClick={handleConfirmDelete} disabled={form.published && !isChecked}>
               Sure
             </button>
             <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCancelDelete}>
               Cancel
             </button>
           </div>
         </div>
       </div>
     </div>
  );

  return (
    <>
      <Button variant={"secondary"}
        asChild className="w-full mt-2 text-md gap-4 mr-2 text-sm hover:bg-red-600 hover:text-white"
        onClick={handleDelete}
      >
        <div className="flex items-center justify-between">Delete <FaTrash/></div>
      </Button>
      {isDeleting && <ConfirmationDialog />}
    </>
  );
}