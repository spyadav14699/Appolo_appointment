import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';

import { login } from '../tools/auth';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Please fill the form!
      </div>
    );
  }
  return '';
};

const Login = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);
  const alert = useAlert();
  const dispatch = useDispatch();

  const onChangeEmail = e => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = e => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = e => {
    e.preventDefault();

    setLoading(true);

    form.current.validateAll();

    // eslint-disable-next-line no-underscore-dangle
    if (checkBtn.current.context._errors.length === 0) {
      dispatch(login(email, password))
        .then(() => {
          setLoading(false);
          alert.show('Logged in', {
            type: 'success',
            timeout: 3000,
          });
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/doctors" />;
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="https://as2.ftcdn.net/v2/jpg/02/19/17/71/1000_F_219177138_ODevdlXP4x2vlOuWykC1CnLouZKdqF35.jpg"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <label htmlFor="email">Enter Your register Email</label>
            <Input
              id="email"
              type="text"
              className="form-control"
              name="email"
              value={email}
              onChange={onChangeEmail}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading} type="submit">
              {loading && (
                <span className="spinner-border spinner-border-sm" />
              )}
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: 'none' }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Login;
