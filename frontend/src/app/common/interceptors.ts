import { HttpInterceptorFn } from "@angular/common/http";

export const prependBaseUrl: HttpInterceptorFn = (req, next) => {
  const base = API_BASE_URL;

  if (!base || isAbsolute(req.url)) {
    return next(req);
  }

  const trimmedBase = String(base).replace(/\/+$/, '');
  const trimmedPath = String(req.url).replace(/^\/+/, '');
  const full = trimmedBase + '/' + trimmedPath;

  const newReq = req.clone({ url: full });
  return next(newReq);

  function isAbsolute(url: string) {
    return url.startsWith('//') || /^[a-z][a-z0-9+\-.]*:\/\//i.test(url);
  }
}
