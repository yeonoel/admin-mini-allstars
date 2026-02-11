export const dateFilters = {
  today: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  },
  
  yesterday: () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday.toISOString().split('T')[0];
  },
  
  thisWeek: () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    firstDay.setHours(0, 0, 0, 0);
    return firstDay.toISOString().split('T')[0];
  },
  
  thisMonth: () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  }
};