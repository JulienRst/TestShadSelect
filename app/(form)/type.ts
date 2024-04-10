import { z } from "zod";

export const formSchema = (baseFruits: string[]) => z.object({
    favoriteFruits: z.array(z.string()).refine((fruits) => fruits.every((fruit) => baseFruits.includes(fruit)))
});

export type FormPayload = z.infer<ReturnType<typeof formSchema>>;

