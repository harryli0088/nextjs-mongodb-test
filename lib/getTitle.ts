export default function getTitle(pageName?:string) {
  const title = "Next.JS MongoDB Test Application"
  return pageName ? `${title} | ${pageName}` : title
}