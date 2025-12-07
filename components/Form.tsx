import { PropsWithChildren } from "react";

export  enum EncType {
  UrlEncoded = "application/x-www-form-urlencoded",
  Multipart = "multipart/form-data"
}

export type FormProps = PropsWithChildren<{
  action: string;
  method: "post" | "put";
  encType?: EncType;
  onSuccess: (res: Response) => void;
  onError?: (error: unknown) => void;
}>;

export function Form({
  method,
  action,
  encType = EncType.UrlEncoded,
  onSuccess,
  onError = () => {},
  children,
}: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    let body: FormData | URLSearchParams = new FormData(form);
    
     if (encType === EncType.UrlEncoded) {
      body = new URLSearchParams(body);
     }

    fetch(action, { method, body })
      .then((res) => {
        onSuccess(res);
      })
      .catch((e) => {
        console.error(e);
        onError(e);
      });
  };
  
  return (
    <form
    method={method === "post" ? "post" : undefined }
      action={action}
      encType={encType}
      onSubmit={handleSubmit}>
        {children}
    </form>
  )
}