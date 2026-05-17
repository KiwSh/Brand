import { useState } from "react";
import Footer from "../components/Footer";
import { useLanguage } from "../hooks/useLanguage";

export default function AuthPage({ onSuccess, onBack }) {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const user = { name: email.split('@')[0] || "User", email };
      onSuccess(user);
    } else {
      setIsLogin(true);
      setShowSuccess(true);
      setPassword("");
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <>
      <div className="a-page auth-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 680, alignSelf: 'flex-start' }}>
          <button className="page-back-btn" onClick={onBack}>{t("auth_back")}</button>
        </div>

        <div className="auth-container">
          <h1 className="auth-title">
            {isLogin ? t("auth_title_login").split(' ')[0] + " " : t("auth_title_register").split(' ')[0] + " "}
            <em>{isLogin ? t("auth_title_login").split(' ').slice(1).join(' ') : t("auth_title_register").split(' ').slice(1).join(' ')}</em>
          </h1>
          
          {showSuccess && (
            <div style={{ background: 'var(--mist)', borderLeft: '2px solid var(--gold)', padding: '16px 20px', marginBottom: 24 }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ink)' }}>
                {t("auth_success")}
              </p>
            </div>
          )}

          <p className="auth-subtitle">
            {isLogin ? t("auth_sub_login") : t("auth_sub_register")}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>{t("auth_name")}</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Jane Doe"
                />
              </div>
            )}
            <div className="form-group">
              <label>{t("auth_email")}</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label>{t("auth_password")}</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary auth-submit">
              {isLogin ? t("auth_btn_login") : t("auth_btn_register")}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? t("auth_switch_register").split("?")[0] + "? " : t("auth_switch_login").split("?")[0] + "? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t("auth_switch_register").split("?").pop().trim() : t("auth_switch_login").split("?").pop().trim()}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
