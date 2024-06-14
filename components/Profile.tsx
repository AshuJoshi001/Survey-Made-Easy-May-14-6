import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

function Profile({ isOpen, onClose }: ProfileProps) {
  // const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
  const [footerContent, setFooterContent] = useState(localStorage.getItem('footerContent') || '');
  const [image, setImage] = useState(localStorage.getItem('image') || '');
  const [isEditing, setEditing] = useState(false);

  // Add a new state to track if the form is valid
  const [isFormValid, setFormValid] = useState(false);

   // Add new states to track if the fields are touched
  //  const [isCompanyNameTouched, setCompanyNameTouched] = useState(false);
   const [isFooterContentTouched, setFooterContentTouched] = useState(false);
   const [isImageTouched, setImageTouched] = useState(false);

   const [isFirstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (!isEditing) {
      // localStorage.setItem('companyName', companyName);
      localStorage.setItem('footerContent', footerContent);
      localStorage.setItem('image', image);
    }
       // Check if all required fields are filled
    const allFieldsFilled = footerContent.trim() !== '' && image !== '';
    setFormValid(allFieldsFilled);

    // If all fields are filled, it's not the first time
    if (allFieldsFilled) {
      setFirstTime(false);
    }
  }, [footerContent, image, isEditing]);

  // const handleCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (isEditing) {
  //     setCompanyName(e.target.value);
  //   }
  // };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (isEditing && e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFooterContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (isEditing) {
      setFooterContent(e.target.value);
      localStorage.setItem('footerContent', e.target.value); // Save to localStorage
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    localStorage.removeItem('image');
  };

  const handleEdit = () => {
    if (isEditing) {
      if ( footerContent.trim() === '' || image === '') {
        // If the fields are empty when the "Save" button is clicked, mark them as touched
        // setCompanyNameTouched(true);
        setFooterContentTouched(true);
        setImageTouched(true);
        return;
      }else{
        onClose();
      }
    }
    setEditing(!isEditing);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 transform scale-105 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-200 z-10`}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-full md:w-96 rounded-md">
        {/* <label htmlFor="companyName" className='font-bold'>Enter company name:</label>
        <input id="companyName" type="text" value={companyName} onChange={handleCompanyNameChange} disabled={!isEditing} className={`border p-2 w-full ${isCompanyNameTouched && companyName.trim() === '' ? 'border-red-500' : ''}`} /> */}

        <label htmlFor="footerContent" className='font-bold'>Add your footer content:</label>
        <textarea id="footerContent" value={footerContent} onChange={handleFooterContentChange} disabled={!isEditing} className={`border p-2 w-full h-auto ${isFooterContentTouched && footerContent.trim() === '' ? 'border-red-500' : ''}`} />

        <label htmlFor="imageUpload" className='font-bold'>Upload your logo:</label>
        {isEditing && <input id="imageUpload" type="file" onChange={handleImageChange} className={`border p-2 w-full mt-2 ${isEditing && image === '' ? 'border-red-500' : ''}`} />}
        {image && (
          <div className="relative mt-2 w-full h-auto">
            <Image src={image} alt="Uploaded" layout="responsive" width={20} height={20} />
            {isEditing && <button onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-md">X</button>}
          </div>
        )}
        <div>
        <button onClick={handleEdit} className="mt-2 mr-2 bg-blue-500 text-white px-4 py-2 rounded-md" >{isEditing ? 'Save' : 'Edit'}</button>
        <button onClick={onClose} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md ">Close</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
