package auth

type AuthenticationResponse struct {
	State bool
}

func (a *AuthenticationResponse) AuthenticateUser(username, password string) (*AuthenticationResponse, error) {
	return &AuthenticationResponse{}, nil
}

func (a *AuthenticationResponse) AuthenticateToken(token string) (*AuthenticationResponse, error) {
	return &AuthenticationResponse{}, nil
}

type AuthenticationInterface interface {
	AuthenticateUser(username, password string) (*AuthenticationResponse, error)
	AuthenticateToken(token string) (*AuthenticationResponse, error)
}

func NewAuthentication() AuthenticationInterface {
	return &AuthenticationResponse{}
}
