"use client";

import { GetFormContentByUrl } from '@/action/form';
import { FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import React, { useState, useEffect } from 'react';



interface FormType {
  content: string;
  // Include other properties of form if needed
}

function SubmitPage({
  params,
}:{
  params:{
    formUrl:string;
    };
  }) {


  const [selectedPosition, setPosition] = useState('');
  const [form, setForm] = useState<FormType | null>(null);
  useEffect(() => {
    async function fetchForm() {
      const fetchedForm = await GetFormContentByUrl(params.formUrl);
      setForm(fetchedForm);
    }

    fetchForm();
  }, [params.formUrl]);

  if(!form){
    return <div>Loading...</div>;
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];
  return (
    <FormSubmitComponent formUrl={params.formUrl} content={formContent} selectedPosition={selectedPosition} />
  );
}

export default SubmitPage;
