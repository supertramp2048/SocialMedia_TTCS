import apiClient from './apiClient'
export const dashboardApi = {
  // Lấy danh sách quảng cáo (admin)
  getDashBoardIndex: async () => {
    const res = await apiClient.get('/api/moderator/dashboard/stats')
    //console.log("index been api ",res);
    return res
  },
}
