import { supabase } from './supabaseClient'
import { startOfDay, endOfDay, format } from 'date-fns'

export const logService = {
    async getDailyLogs(date) {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const { data, error } = await supabase
            .from('daily_logs')
            .select(`
        *,
        products (
          name,
          category,
          cost_price,
          selling_price,
          box_number
        )
      `)
            .eq('date', formattedDate)
        if (error) throw error
        return data
    },

    async bulkUpsertDailyLogs(logs) {
        const { data, error } = await supabase
            .from('daily_logs')
            .upsert(logs, { onConflict: 'product_id, date' })
            .select()
        if (error) throw error
        return data
    },

    async upsertDailyLog(log) {
        return this.bulkUpsertDailyLogs([log]).then(data => data[0])
    },

    async getTodaySummary() {
        const today = format(new Date(), 'yyyy-MM-dd')
        const { data, error } = await supabase
            .from('daily_logs')
            .select('sales_amount, profit')
            .eq('date', today)

        if (error) throw error

        return data.reduce((acc, curr) => ({
            totalSales: acc.totalSales + (curr.sales_amount || 0),
            totalProfit: acc.totalProfit + (curr.profit || 0)
        }), { totalSales: 0, totalProfit: 0 })
    }
}
