"use client";

import { MdImage } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input"; // Import FileInput
import { FileInput } from "../ui/file";
import { z } from "zod"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const type:ElementsType = "ImageField";
const extraAttributes = {
            label:"Image Field",
            helperText:"Helper Text",
            required:false,
};

const propertiesSchema = z.object({
    label : z.string().min(2).max(50),
    helperText:z.string().max(200),
    required:z.boolean().default(false),
});

export const ImageFieldFormElement:FormElement={
    type,
    construct:(id:string)=>({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement:{
        icon:MdImage,
        label:"Image Field",
    },
    designerComponent:DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent:PropertiesComponent,

    validate:(formElement:FormElementInstance, currentValue:string): boolean=> {
        const element = formElement as CustomInstance;

        if(element.extraAttributes.required){
            return currentValue.length>0;
        }

        return true;
    },
};

type CustomInstance = FormElementInstance &{
    extraAttributes: typeof extraAttributes;
};

function DesignerComponent({elementInstance,}:{
    elementInstance:FormElementInstance;
}){
    const element = elementInstance as CustomInstance;
    const {label, required, helperText} = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required && "*"}
        </Label>
        <FileInput readOnly disabled /> 
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>;
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}:{
    elementInstance:FormElementInstance;
    submitValue?:SubmitFunction;
    isInvalid?: boolean;
    defaultValue?:string;
}){
    const element = elementInstance as CustomInstance;
    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);
    
    useEffect(()=>{
        setError(isInvalid===true);
    },
    [isInvalid]);

    const {label, required, helperText} = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label className={cn(error && "text-red-500")}>
            {label}
            {required && "*"}
        </Label>
        <FileInput className={cn(error && "border-red-500")} // Use FileInput instead of Input
        
        onChange={(e)=> {
            if (e.target.files) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setValue(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }}
        onBlur={(e)=>{
            if(!submitValue) return;
            const valid = ImageFieldFormElement.validate(element, value);
            setError(!valid);
            if(!valid) return;
            submitValue(element.id, value);
        }} 
        />
        {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
    </div>;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
    elementInstance
}:
{elementInstance:FormElementInstance;})
{
    const element = elementInstance as CustomInstance;
    const {updateElement} = useDesigner();
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode:"onBlur",
        defaultValues:{
            label:element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
        },
    });

    useEffect(()=>{
        form.reset(element.extraAttributes);
    },[element, form]);

    function applyChanges(values:propertiesFormSchemaType){
        const {label,helperText,required} = values;
        updateElement(element.id,{
            ...element,
            extraAttributes:{
                label,
                helperText,
                required,
            },
        });
    }
    return (
    <Form {...form} >
        <form onBlur={form.handleSubmit(applyChanges)} 
        onSubmit={(e)=>{
            e.preventDefault();
        }}
        className="space-y-3">
            <FormField
            control={form.control}
            name="label"
            render={({field})=>(
                <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                        <Input {...field}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter") e.currentTarget.blur();
                        }} 
                        />
                    </FormControl>
                    <FormDescription>
                        The label of the field. <br/> It will displayed above the field.
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="helperText"
            render={({field})=>(
                <FormItem>
                    <FormLabel>Helper Text</FormLabel>
                    <FormControl>
                        <Input {...field}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter") e.currentTarget.blur();
                        }} 
                        />
                    </FormControl>
                    <FormDescription>
                      The helper text of the field. <br />
                      It will be displayed below the field.
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
           <FormField
            control={form.control}
            name="required"
            render={({field})=>(
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                    <FormDescription>
                      The Placeholder of the field.
                    </FormDescription>                    
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    </div>
                    <FormMessage/>
                </FormItem>
            )}
        /> 
        </form>
    </Form>
    );
}