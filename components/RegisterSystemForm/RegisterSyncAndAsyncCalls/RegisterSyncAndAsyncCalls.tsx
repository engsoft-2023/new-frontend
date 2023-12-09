import { Button } from "@components/Button";
import {
  RegisterForm,
  RegisterFormFieldset,
  RegisterFormInput,
  RegisterFormLabel,
} from "../styled";
// import { useRegisterEndpoints } from "./hook";

export const RegisterSyncAndAsyncCalls = () => {
  // const {
  //   loading,
  //   serviceToOpenApiFilename,
  //   setServiceToOpenApiFilename,
  //   registerEndpoints,
  // } = useRegisterEndpoints();

  // return (
  //   <RegisterForm
  //     onSubmit={(e) => {
  //       e.preventDefault();
  //       registerEndpoints();
  //     }}
  //   >
  //     {Object.entries(serviceToOpenApiFilename).map(
  //       ([serviceName, openApiFilename]) => (
  //         <RegisterFormFieldset key={serviceName}>
  //           <RegisterFormLabel htmlFor={serviceName}>
  //             OpenAPI filename for service {serviceName}:
  //           </RegisterFormLabel>
  //           <RegisterFormInput
  //             data-testid={serviceName}
  //             type="text"
  //             name={serviceName}
  //             value={openApiFilename}
  //             onChange={(event) =>
  //               setServiceToOpenApiFilename(serviceName, event.target.value)
  //             }
  //           />
  //         </RegisterFormFieldset>
  //       )
  //     )}

  //     <Button type="submit" loading={loading}>
  //       Register endpoints
  //     </Button>
  //   </RegisterForm>
  // );
  return (
    <p>Futura pagina de registrar relações sync e async de serviços</p>
  )
};
