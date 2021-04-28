<?php

namespace App\Scope\Author;

use Yonna\QuickStart\Mapping\Essay\EssayCategoryStatus;
use Yonna\QuickStart\Prism\EssayCategoryPrism;
use Yonna\Database\DB;
use Yonna\Database\Driver\Pdo\Where;
use Yonna\QuickStart\Scope\AbstractScope;
use Yonna\Throwable\Exception;
use Yonna\Validator\ArrayValidator;

/**
 * Class EssayCategory
 * @package Yonna\QuickStart\Scope
 */
class EssayCategory extends AbstractScope
{

    const TABLE = 'essay_category';

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
     * @throws Exception\DatabaseException
     * @throws Exception\ThrowException
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
    public function multi(): array
    {
        $prism = new EssayCategoryPrism($this->request());
        $prism->setUserId($this->request()->getLoggingId());
        return DB::connect()->table(self::TABLE)
            ->where(function (Where $w) use ($prism) {
                $prism->getId() && $w->equalTo('id', $prism->getId());
                $prism->getUpperId() && $w->equalTo('upper_id', $prism->getUpperId());
                $prism->getUserId() && $w->equalTo('user_id', $prism->getUserId());
                $prism->getName() && $w->like('name', '%' . $prism->getName() . '%');
                $prism->getStatus() && $w->equalTo('status', $prism->getStatus());
            })
            ->orderBy('sort', 'desc')
            ->multi();
    }

    /**
     * @return mixed
     * @throws Exception\DatabaseException
     */
    public function page(): array
    {
        $prism = new EssayCategoryPrism($this->request());
        $prism->setUserId($this->request()->getLoggingId());
        return DB::connect()->table(self::TABLE)
            ->where(function (Where $w) use ($prism) {
                $prism->getId() && $w->equalTo('id', $prism->getId());
                $prism->getUserId() && $w->equalTo('user_id', $prism->getUserId());
                $prism->getName() && $w->like('name', '%' . $prism->getName() . '%');
                $prism->getStatus() && $w->equalTo('status', $prism->getStatus());
            })
            ->orderBy('sort', 'desc')
            ->page($prism->getCurrent(), $prism->getPer());
    }

    /**
     * @return int
     * @throws Exception\DatabaseException
     */
    public function insert()
    {
        ArrayValidator::required($this->input(), ['name'], function ($error) {
            Exception::throw($error);
        });
        $add = [
            'name' => $this->input('name'),
            'logo' => $this->input('logo') ?? [],
            'upper_id' => $this->input('upper_id') ?? 0,
            'user_id' => $this->request()->getLoggingId(),
            'status' => $this->input('status') ?? EssayCategoryStatus::PENDING,
            'sort' => $this->input('sort') ?? 0,
        ];
        return DB::connect()->table(self::TABLE)->insert($add);
    }

    /**
     * @return int
     * @throws Exception\DatabaseException
     * @throws Exception\ThrowException
     */
    public function update()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $this->check();
        $data = [
            'name' => $this->input('name'),
            'logo' => $this->input('logo'),
            'upper_id' => $this->input('upper_id'),
            'status' => EssayCategoryStatus::PENDING,
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
     * @throws Exception\DatabaseException
     * @throws Exception\ThrowException
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
     * @throws Exception\DatabaseException
     * @throws Exception\ThrowException
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
     * @throws Exception\DatabaseException
     * @throws Exception\ThrowException
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