'use server';

export async function action (prevState: unknown, formData: FormData) {
    console.log(formData.getAll('favoriteFruits[]'));
}