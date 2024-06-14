"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";
// import { error } from "console";



class UserNotFoundErr extends Error{}

export async function GetFormStats(){
    const user  = await currentUser();
    if(!user){
        throw new UserNotFoundErr()
    }

    const stats  = await prisma.form.aggregate({
        where:{
            userId: user.id,
        },
        _sum:{
            visits: true,
            submissions:true
        }
    })

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0 ;

    let submissionsRate = 0;
    if(visits>0){
        submissionsRate = (submissions/visits)*100;
    }

    const bounceRate = 100 - submissionsRate;

    return{
        visits, submissions, submissionsRate, bounceRate
    }
}

export async function CreateForm(data:formSchemaType){
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Invalid data passed to the server");
    }
    
    const user = await currentUser();
    if(!user){
        throw new UserNotFoundErr();
    }

    const {name, description} = data;

    const form = await prisma.form.create({
        data:{
            userId:user.id,
            name,
            description
        }
    })

    if(!form){
        throw new Error("Something went wrong");
    }

    return form.id
    
}


export async function GetForms() {
    const user = await currentUser();
    if(!user){
        throw new UserNotFoundErr();
    }

    return await prisma.form.findMany({
        where:{
            userId:user.id,
        },
        orderBy:{
            createdAt: "desc"
        }
    })
}

export async function GetFormById(id:number){
    const user = await currentUser();
    if(!user){
        throw new UserNotFoundErr();
    }

    return await prisma.form.findUnique({
        where:{
            userId: user.id,
            id
        }
    })
}

export async function UpdateFormContent (id:number, JsonContent:string){
    const user = await currentUser();
    if(!user){
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        where:{
            userId:user.id,
            id,
        },
        data:{
            content:JsonContent
        }
    })
}

export async function PublishForm(id:number){
    const user = await currentUser();
    if(!user){
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        data:{
            published: true,
        },
        where:{
            userId: user.id,
            id
        }
    })
}


export async function GetFormContentByUrl(formUrl:string){
    return await prisma.form.update({
        select:{
            content:true,
        },
        data:{
            visits:{
                increment:1
            }
        },
        where:{
            shareURL:formUrl
        }
    })
}


export async function SubmitForm(formUrl:string, content:string){
    return await prisma.form.update({
        data:{
            submissions:{
                increment:1
            },
            FormSubmissions:{
                create:{
                    content
                }
            }
        },
        where: {
            shareURL:formUrl,
            published:true
        }
    })
}


export async function GetFormWithSubmission(id:number){
    const user = await currentUser();
    if(!user){
        throw new UserNotFoundErr();
    }

    return await prisma.form.findUnique({
        where:{
            userId:user.id,
            id
        },
        include:{
            FormSubmissions:true
        }
    })
}


export async function DeleteForm(id: number) {
    const user = await currentUser();
    if (!user) {
      throw new UserNotFoundErr();
    }
  
    // Fetch the form from the database
    const form = await prisma.form.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
  
    // Check the form existence
    if (!form) {
      throw new Error('Form not found');
    }
  
    // Delete the form and its submissions (if published)
    if (form.published) {
      await prisma.$transaction([
        prisma.formSubmissions.deleteMany({
          where: {
            formId: id,
          },
        }),
        prisma.form.delete({
          where: {
            userId: user.id,
            id,
          },
        }),
      ]);
    } else {
      // Delete only the form (if unpublished)
      await prisma.form.delete({
        where: {
          userId: user.id,
          id,
        },
      });
    }
  
    return; // Or you can return a success message if needed
  }
  
  

// export async function DeleteForm(id: number) {
//     const user = await currentUser();
//     if (!user) {
//       throw new UserNotFoundErr();
//     }
  
//     // Fetch the form from the database
//     const form = await prisma.form.findUnique({
//       where: {
//         userId: user.id,
//         id,
//       },
//     });
  
//     // Check the published status of the form
//     if (form && !form.published) {
//       // If the form is not published, delete it
//       return await prisma.form.delete({
//         where: {
//           userId: user.id,
//           id,
//         },
//       });
//     } else {
//       // If the form is published, throw an error or return a message
//       throw new Error('The form is published and cannot be deleted');
//     }
//   }
  

// export async function DeleteForm(id: number) {
//     const user = await currentUser();
//     if (!user) {
//       throw new UserNotFoundErr();
//     }
  
//     return await prisma.form.delete({
//       where: {
//         userId: user.id,
//         id,
//       },
//     });
//   }
  

// export async function UpdateProfile(data: profileSchemaType): Promise<number> {
//     const validation = profileSchema.safeParse(data);
  
//     if (!validation.success) {
//       throw new Error("Invalid data passed to the server");
//     }
  
//     const { imageUrl, footerText } = data;
  
//     let userId;
//     try {
//       const user = await currentUser();
//       userId = user?.id || 'default'; // Use a default userId if no user is logged in
//     } catch (error) {
//       throw new UserNotFoundErr();
//     }
  
//     let profile;
//     try {
//       // Upsert the profile using the userId
//       profile = await prisma.profile.upsert({
//         where: { userId },
//         update: {
//           imageUrl,
//           footerText
//         },
//         create: {
//           userId,
//           imageUrl,
//           footerText
//         }
//       });
//     } catch (error) {
//       throw new Error("Something went wrong when upserting the profile");
//     }
  
//     return profile.id;
//   }
  
// export async function UpdateProfile(data: profileSchemaType): Promise<number> {
//     const validation = profileSchema.safeParse(data);

//     if (!validation.success) {
//         throw new Error("Invalid data passed to the server");
//     }

//     let user;
//     try {
//         user = await currentUser();
//     } catch (error) {
//         throw new UserNotFoundErr();
//     }

//     // If user is null, throw an error
//     if (!user) {
//         throw new Error("User not found");
//     }

//     const { imageUrl, footerText } = data;

//     let profile;
//     try {
//         // Upsert the profile using the userId
//         profile = await prisma.profile.upsert({
//             where: { userId:String(user.id) },
//             update: {
//                 imageUrl,
//                 footerText
//             },
//             create: {
//                 userId: String(user.id), // userId is a string
//                 imageUrl,
//                 footerText
//             }
//         });
//     } catch (error) {
//         throw new Error("Something went wrong when upserting the profile");
//     }

//     return profile.id;
// }




// export async function fetchProfile(): Promise<profileSchemaType> {
//     let user;
//     try {
//       user = await currentUser();
//     } catch (error) {
//       throw new UserNotFoundErr();
//     }
  
//     // If user is null, throw an error
//     if (!user) {
//       throw new Error("User not found");
//     }
  
//     let profile;
//     try {
//       // Fetch the profile using the userId
//       profile = await prisma.profile.findUnique({
//         where: { userId: user.id },
//       });
//     } catch (error) {
//       throw new Error("Something went wrong when fetching the profile");
//     }
  
//     // If profile is null, throw an error
//     if (!profile) {
//       throw new Error("Profile not found");
//     }
  
//     // Ensure imageUrl and footerText are not null
//     const imageUrl = profile.imageUrl || undefined;
//     const footerText = profile.footerText || undefined;
  
//     return { imageUrl, footerText };
// }
  
  

// export async function fetchProfile(): Promise<profileSchemaType> {
//     let user;
//     try {
//       user = await currentUser();
//     } catch (error) {
//       throw new UserNotFoundErr();
//     }
  
//     // If user is null, throw an error
//     if (!user) {
//       throw new Error("User not found");
//     }
  
//     let profile;
//     try {
//       // Fetch the profile using the userId
//       profile = await prisma.profile.findUnique({
//         where: { userId: user.id },
//       });
//     } catch (error) {
//       throw new Error("Something went wrong when fetching the profile");
//     }
  
//     // If profile is null, throw an error
//     if (!profile) {
//       throw new Error("Profile not found");
//     }
  
//     // Ensure imageUrl and footerText are not null
//     const { imageUrl, footerText } = profile;
//     if (imageUrl === null || footerText === null) {
//       throw new Error("Invalid profile data");
//     }
  
//     return { imageUrl, footerText };
//   }
  
  
  





  