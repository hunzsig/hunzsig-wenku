<?php

namespace App\Scope\Normal;

use Yonna\QuickStart\Mapping\Essay\EssayStatus;
use Yonna\QuickStart\Prism\EssayPrism;
use Yonna\Database\DB;
use Yonna\Database\Driver\Pdo\Where;
use Yonna\QuickStart\Scope\AbstractScope;
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
     * @return mixed
     * @throws Exception\DatabaseException
     */
    public function multi(): array
    {
        ArrayValidator::required($this->input(), ['category_id'], function ($error) {
            Exception::throw($error);
        });
        $prism = new EssayPrism($this->request());
        return DB::connect()->table(self::TABLE)
            ->where(function (Where $w) use ($prism) {
                $w->equalTo('status', EssayStatus::ENABLE);
                $w->equalTo('category_id', $prism->getCategoryId());
                $prism->getId() && $w->equalTo('id', $prism->getId());
                $prism->getTitle() && $w->like('title', '%' . $prism->getTitle() . '%');
                $prism->getIsExcellent() && $w->equalTo('is_excellent', $prism->getIsExcellent());
            })
            ->orderBy('is_excellent', 'desc')
            ->orderBy('sort', 'desc')
            ->orderBy('publish_time', 'desc')
            ->orderBy('likes', 'desc')
            ->orderBy('views', 'desc')
            ->multi();
    }

    /**
     * @return int
     * @throws Exception\DatabaseException
     */
    public function views()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $id = $this->input('id');
        $k = "ev:" . $id . ':' . $this->request()->getClientId();
        if (DB::redis()->get($k) === 1) {
            return true;
        }
        DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $id))
            ->update([
                'views' => ['exp', '`views`+1']
            ]);
        DB::redis()->set($k, 1, 3600);
        return true;
    }

    /**
     * @return bool
     * @throws Exception\DatabaseException
     * @throws Exception\ErrorException
     */
    public function likes()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        $id = $this->input('id');
        $k = "el:" . $id . ':' . $this->request()->getClientId();
        if (DB::redis()->get($k) === 1) {
            Exception::error('Already liked');
        }
        DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->update([
                'likes' => ['exp', '`likes`+1']
            ]);
        DB::redis()->set($k, 1, 600);
        return true;
    }

}