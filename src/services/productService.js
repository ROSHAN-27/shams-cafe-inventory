import { supabase } from './supabaseClient'

export const productService = {
    async getAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true })
        if (error) throw error
        return data
    },

    async addProduct(product) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
        if (error) throw error
        return data[0]
    },

    async updateProduct(id, updates) {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
        if (error) throw error
        return data[0]
    },

    async deleteProduct(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
        if (error) throw error
    }
}
