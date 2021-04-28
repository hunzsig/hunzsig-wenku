<?php

namespace App\Scope\Normal;

use Yonna\Database\DB;
use Yonna\Database\Driver\Pdo\Where;
use Yonna\QuickStart\Helper\Password;
use Yonna\QuickStart\Scope\AbstractScope;
use Yonna\QuickStart\Scope\User;
use Yonna\Throwable\Exception;

class Me extends AbstractScope
{

    /**
     * 获取当前登录用户详情
     * @return array
     * @throws Exception\ThrowException
     */
    public function one(): array
    {
        return $this->scope(User::class, 'one', ['id' => $this->request()->getLoggingId()]);
    }

    /**
     * @return int
     * @throws Exception\DatabaseException
     * @throws Exception\ParamsException
     */
    public function password()
    {
        $pwd = $this->input('password');
        if ($pwd) {
            if (!Password::check($pwd)) {
                Exception::params(Password::getFalseMsg());
            }
            $pwd = Password::parse($pwd);
        }
        $data = ['password' => $pwd];
        if ($data) {
            return DB::connect()->table('user')
                ->where(fn(Where $w) => $w->equalTo('id', $this->request()->getLoggingId()))
                ->update($data);
        }
        return true;
    }

    /**
     * @return mixed
     * @throws Exception\ThrowException
     */
    public function update()
    {
        $data = $this->input();
        $data['id'] = $this->request()->getLoggingId();
        return $this->scope(User::class, 'update', $data);
    }

}