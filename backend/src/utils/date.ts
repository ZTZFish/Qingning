// 时间格式化工具类

/**
 * 格式化日期为 YYYY-MM-DD HH:mm:ss 格式
 * @param date Date 对象或时间戳
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date Date 对象或时间戳
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 格式化时间为 HH:mm:ss 格式
 * @param date Date 对象或时间戳
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化日期为相对时间（如：刚刚、5分钟前、1小时前、昨天等）
 * @param date Date 对象或时间戳
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const now = Date.now();
  const d = new Date(date).getTime();
  const diff = now - d;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
};