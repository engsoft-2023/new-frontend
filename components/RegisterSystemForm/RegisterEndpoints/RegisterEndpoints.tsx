import { Button } from "@components/Button";
import {
  RegisterForm,
  RegisterFormFieldset,
  RegisterFormInput,
  RegisterFormLabel,
} from "../styled";
import { useRegisterEndpoints } from "./hook";

export const RegisterEndpoints = () => {
  const {
    loading,
    serviceToOpenApiFilename,
    setServiceToOpenApiFilename,
    registerEndpoints,
  } = useRegisterEndpoints();

  return (
    <RegisterForm
      onSubmit={(e) => {
        e.preventDefault();
        registerEndpoints();
      }}
    >
      {Object.entries(serviceToOpenApiFilename).map(
        ([serviceName, openApiFilename]) => (
          <RegisterFormFieldset key={serviceName}>
            <RegisterFormLabel htmlFor={serviceName}>
              OpenAPI filename for service {serviceName}:
            </RegisterFormLabel>
            <RegisterFormInput
              type="text"
              name={serviceName}
              value={openApiFilename}
              onChange={(event) =>
                setServiceToOpenApiFilename(serviceName, event.target.value)
              }
            />
          </RegisterFormFieldset>
        )
      )}

      <Button type="submit" loading={loading}>
        Register endpoints
      </Button>
    </RegisterForm>
  );
};
