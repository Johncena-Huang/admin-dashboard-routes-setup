<template>
  <a-row align="middle" justify="center" style="min-height: 100vh;">
    <a-col>
      <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <div class="login-form-wrap">
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
          </a-form-item>
          <a class="login-form-forgot" href="">Forgot password</a>
        </div>
        <a-form-item>
          <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
            Log in
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script>
import { defineComponent, reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter()
    const formState = reactive({
      username: '',
      password: '',
      remember: true,
    });
    const onFinish = (values) => {
      console.log('Success:', values);
      const response = {
        token: Date.now().toString(),
        authorityList: [
          {
            frontId: 'homepage', id: 'index-parent', name: 'index-management', select: true, sort: 1, children: 
            [
              { frontId: 'homepage-1', id: 'index-user-center', name: 'index-user-center', select: true, sort: 1, children: [] },
              { frontId: 'homepage-2', id: 'index-platform-data', name: 'index-platform-data', select: true, sort: 2, children: [] }
            ]
          },
          {
            frontId: 'systemManage', id: 'system-parent', name: 'system-management', select: true, sort: 1, children: 
            [
              { frontId: 'systemManage-1', id: 'system-announcement', name: 'system-announcement', select: true, sort: 1, children: [] },
              { frontId: 'systemManage-2', id: 'system-advertisement', name: 'system-advertisement', select: true, sort: 2, children: [] }
            ]
          }
        ]
      }
      sessionStorage.setItem('token', response.token)
      sessionStorage.setItem('routes', JSON.stringify(response.authorityList))
      router.push('/user-center')
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });
    return {
      formState,
      onFinish,
      onFinishFailed,
      disabled,
    };
  },
});
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#components-form-demo-normal-login .login-form-forgot {
  margin-bottom: 24px;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>