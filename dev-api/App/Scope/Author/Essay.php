<?php

namespace App\Scope\Author;

use Yonna\QuickStart\Mapping\Common\Boolean;
use Yonna\QuickStart\Mapping\Essay\EssayStatus;
use Yonna\Database\DB;
use Yonna\Database\Driver\Pdo\Where;
use Yonna\QuickStart\Prism\EssayPrism;
use Yonna\QuickStart\Scope\AbstractScope;
use Yonna\QuickStart\Scope\User;
use Yonna\Throwable\Exception;
use Yonna\Validator\ArrayValidator;

/**
 * Class Essay
 * @package Yonna\QuickStart\Scope
 */
class Essay extends AbstractScope
{

    const TABLE = 'essay';

    /**
     * @throws Exception\DatabaseException
     * @throws Exception\ThrowException
     */
    private function check()
    {
        if ($this->input('id')) {
            $one = DB::connect()->table(self::TABLE)->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))->one();
            if ($one[self::TABLE . '_user_id'] != $this->request()->getLoggingId()) {
                Exception::throw("404");
            }
        }
        if ($this->input('ids')) {
            $one = DB::connect()->table(self::TABLE)->where(fn(Where $w) => $w->in('id', $this->input('ids')))->one();
            if ($one[self::TABLE . '_user_id'] != $this->request()->getLoggingId()) {
                Exception::throw("404");
            }
        }
    }

    /**
     * @return mixed
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function one(): array
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->one();
    }

    /**
     * @return mixed
     * @throws Exception\DatabaseException
     */
    public function page(): array
    {
        $prism = new EssayPrism($this->request());
        $prism->setUserId($this->request()->getLoggingId());
        return DB::connect()->table(self::TABLE)
            ->where(function (Where $w) use ($prism) {
                $prism->getUserId() && $w->equalTo('user_id', $prism->getUserId());
                $prism->getId() && $w->equalTo('id', $prism->getId());
                $prism->getTitle() && $w->like('title', '%' . $prism->getTitle() . '%');
                $prism->getStatus() && $w->equalTo('status', $prism->getStatus());
                $prism->getCategoryId() && $w->equalTo('category_id', $prism->getCategoryId());
                $prism->getIsExcellent() && $w->equalTo('is_excellent', $prism->getIsExcellent());
            })
            ->orderBy('sort', 'desc')
            ->orderBy('id', 'desc')
            ->page($prism->getCurrent(), $prism->getPer());
    }

    /**
     * @return int
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function insert()
    {
        ArrayValidator::required($this->input(), ['title', 'category_id'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        $content = $this->xoss_save($this->input('content') ?? '');
        $me = $this->scope(User::class, 'one', ['id' => $this->request()->getLoggingId()]);
        $data = [
            'user_id' => $this->request()->getLoggingId(),
            'title' => $this->input('title'),
            'category_id' => $this->input('category_id') ?? 0,
            'status' => $this->input('status') ?? EssayStatus::DISABLED,
            'is_excellent' => $this->input('is_excellent') ?? Boolean::false,
            'content' => $content,
            'author' => $me['user_account'][0]['user_account_string'],
            'publish_time' => $this->input('publish_time') ?? time(),
            'sort' => $this->input('sort') ?? 0,
        ];
        return DB::connect()->table(self::TABLE)->insert($data);
    }

    /**
     * @return int
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function update()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        $content = $this->xoss_save($this->input('content') ?? null);
        $data = [
            'title' => $this->input('title'),
            'category_id' => $this->input('category_id'),
            'status' => EssayStatus::DISABLED,
            'is_excellent' => $this->input('is_excellent'),
            'content' => $content,
            'publish_time' => $this->input('publish_time'),
            'sort' => $this->input('sort'),
        ];
        if ($data) {
            return DB::connect()->table(self::TABLE)
                ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
                ->update($data);
        }
        return true;
    }

    /**
     * @return int
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function delete()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->delete();
    }

    /**
     * @return int
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function multiDelete()
    {
        ArrayValidator::required($this->input(), ['ids'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->in('id', $this->input('ids')))
            ->delete();
    }

    /**
     * @return int
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function excellent()
    {
        ArrayValidator::required($this->input(), ['id', 'is_excellent'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->update([
                'is_excellent' => $this->input('is_excellent') === 1 ? Boolean::true : Boolean::false
            ]);
    }

    /**
     * @return int
     * @throws Exception\DatabaseException|Exception\ThrowException
     */
    public function top()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->update([
                'sort' => time()
            ]);
    }

}