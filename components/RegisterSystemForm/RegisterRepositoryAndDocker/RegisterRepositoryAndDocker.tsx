import { Button } from "@components/Button";
import {
  RegisterForm,
  RegisterFormFieldset,
  RegisterFormInput,
  RegisterFormLabel,
} from "../styled";
import { useRegisterRepositoryAndDocker } from "./hook";

export const RegisterRepositoryAndDocker = () => {
  const {
    loading,
    repositoryUrl,
    dockerComposeFilename,
    setRepositoryUrl,
    setDockerComposeFilename,
    registerSystem,
  } = useRegisterRepositoryAndDocker();

  return (
    <RegisterForm
      onSubmit={(event) => {
        event.preventDefault();
        registerSystem();
      }}
    >
      <RegisterFormFieldset>
        <RegisterFormLabel htmlFor="repository_url">
          Repository URL:
        </RegisterFormLabel>
        <RegisterFormInput
          data-testid="repository_url"
          type="text"
          name="repository_url"
          value={repositoryUrl}
          onChange={(e) => setRepositoryUrl(e.target.value)}
        />
      </RegisterFormFieldset>

      <RegisterFormFieldset>
        <RegisterFormLabel htmlFor="repository_url">
          Docker-Compose filename:
        </RegisterFormLabel>
        <RegisterFormInput
          data-testid="docker_compose_filename"
          type="text"
          name="docker_compose_filename"
          value={dockerComposeFilename}
          onChange={(e) => setDockerComposeFilename(e.target.value)}
        />
      </RegisterFormFieldset>

      <Button type="submit" loading={loading}>
        Register
      </Button>
    </RegisterForm>
  );
};
