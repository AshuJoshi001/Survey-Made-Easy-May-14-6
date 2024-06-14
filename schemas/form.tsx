import { z } from "zod";

export const formSchema = z.object({
    name:z.string().min(4),
    description: z.string().optional(),
});

// export const profileSchema = z.object({
//     imageUrl: z.string().optional(), // New field for the image URL
//     footerText: z.string().optional(), // New field for the footer text
// })

export type formSchemaType = z.infer<typeof formSchema >
// export type profileSchemaType = z.infer<typeof profileSchema>