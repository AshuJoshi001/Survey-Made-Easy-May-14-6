import React from "react";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";
import { SubTitleFieldElement } from "./fields/SubTitleField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { TextAreaFieldFormElement } from "./fields/TextAreaField";
import { DateFieldFormElement } from "./fields/DateField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { CheckboxFieldFormElement } from "./fields/CheckboxField";
import { ImageFieldFormElement } from "./fields/ImageField";
import {EmailFieldFormElement} from "./fields/EmailField";
// import { HeaderFieldFormElement } from "./fields/HeaderField";
// import { FooterFieldFormElement } from "./fields/FooterField";


export type  ElementsType = 
"TextField" 
| "TitleField" 
| "SubTitleField"
| "ParagraphField"
| "SeparatorField"
| "SpacerField"
| "NumberField"
| "TextAreaField"
| "DateField"
| "SelectField"
| "CheckboxField"
| "ImageField"
|"EmailField";
// | "HeaderField"
// | "FooterField"
export type SubmitFunction = (key:string, value:string)=>void;
export type FormElement = {
    type:ElementsType;

    construct:(id:string) =>FormElementInstance;

    designerBtnElement:{
        icon:React.ElementType;
        label:string;
    };
    designerComponent:React.FC<{
        elementInstance:FormElementInstance;
    }>;
    formComponent:React.FC<{
        elementInstance: FormElementInstance;
        submitValue?:(key:string, value:string)=>void;
        isInvalid?:boolean;
        defaultValue?:string;
    }>;
    propertiesComponent:React.FC<{
        elementInstance:FormElementInstance;
    }>;

    validate :(formElement:FormElementInstance, currentValue:string) => boolean;
};

export type FormElementInstance = {
    id:string;
    type: ElementsType;
    extraAttributes?:Record<string, any>;

};

type FormElementsType = {
    [key in ElementsType]:FormElement;
};
export const FormElements :FormElementsType= {
    TextField:TextFieldFormElement,
    TitleField:TitleFieldFormElement,
    SubTitleField: SubTitleFieldElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextAreaField: TextAreaFieldFormElement,
    DateField : DateFieldFormElement,
    SelectField : SelectFieldFormElement,
    CheckboxField : CheckboxFieldFormElement,
    ImageField: ImageFieldFormElement,
    EmailField:EmailFieldFormElement,
    // HeaderField:HeaderFieldFormElement,
    // FooterField:FooterFieldFormElement,
};

