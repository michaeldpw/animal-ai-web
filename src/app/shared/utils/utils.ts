// 判断用户输入的是否为空
export const isInputEmpty = (input: any) => {
  return !input || input.trim() === '';
}
