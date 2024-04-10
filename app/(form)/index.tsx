'use client';

// https://github.com/radix-ui/primitives/issues/1270

import { useForm } from "react-hook-form";
import { FormPayload, formSchema } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormState, useFormStatus } from "react-dom";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { action } from "./action";


interface ShadSelectProps {
    fruits: string[];
}


const ShadSelect = ({ fruits }: ShadSelectProps) => {
    const form = useForm<FormPayload>({
        resolver: zodResolver(formSchema(fruits)),
        defaultValues: {
            favoriteFruits: []
        },
        mode: 'all',
    })

    const [, formAction] = useFormState<unknown, FormData>(async (state, payload) => {
      console.log('FORM ACTION');
      // Nor Shadcn Nor Radix handle Multi-Select or things like this
      // But FormData do.
      const { favoriteFruits } = form.getValues();
      favoriteFruits.forEach((fruit) => {
        payload.append('favoriteFruits[]', fruit);
      });

      await action(state, payload);
    }, null)

    const handlePressed = (pressed: boolean, fruit: string, value: string[]) => {
      if (pressed && !value.includes(fruit)) {
        form.setValue('favoriteFruits', [...value, fruit]);
      }
      else if (!pressed && value.includes(fruit)) {
        const tmp = [...value];
        tmp.splice(value.indexOf(fruit), 1);
        form.setValue('favoriteFruits', [...tmp]);
      }
      form.trigger('favoriteFruits');
    }

    return (
      <Form {...form}>
        <form action={formAction}>
          <FormField 
            control={form.control}
            name="favoriteFruits" 
            render={({ field }) => (
              <FormItem defaultValue={field.value}>
                <FormLabel>Tes fruits préférés</FormLabel>
                  {fruits.map((fruit) => (
                    <FormControl key={fruit}>
                      <FormItem >
                        <FormControl>
                          <Toggle onPressedChange={(pressed) => handlePressed(pressed, fruit, field.value)} pressed={field.value.includes(fruit)} name={fruit}>{fruit}</Toggle>
                        </FormControl>
                      </FormItem>
                    </FormControl>
                    ))}
              </FormItem>
            )}
          />
          <Button type="submit">Confirmer</Button>
        </form>
        <p>{JSON.stringify(form.getValues())}</p>
      </Form>
    );
}

export default ShadSelect;