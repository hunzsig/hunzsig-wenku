<?php

namespace App\Scope;

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
    public function page(): array
    {
        ArrayValidator::required($this->input(), ['category_id'], function ($error) {
            Exception::throw($error);
        });
        $prism = new EssayPrism($this->request());
        return DB::connect()->table(self::TABLE)
            ->where(function (Where $w) use ($prism) {
                $w->equalTo('status', EssayStatus::ENABLED);
                $w->equalTo('category_id', $prism->getCategoryId());
                $prism->getId() && $w->equalTo('id', $prism->getId());
                $prism->getTitle() && $w->like('title', '%' . $prism->getTitle() . '%');
                $prism->getIsExcellent() && $w->equalTo('is_excellent', $prism->getIsExcellent());
            })
            ->orderBy('sort', 'desc')
            ->orderBy('likes', 'desc')
            ->orderBy('views', 'desc')
            ->page($prism->getCurrent(), $prism->getPer());
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
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->update([
                'views' => ['exp', '`views`+1']
            ]);
    }

    /**
     * @return int
     * @throws Exception\DatabaseException
     */
    public function likes()
    {
        ArrayValidator::required($this->input(), ['id'], function ($error) {
            Exception::throw($error);
        });
        return DB::connect()->table(self::TABLE)
            ->where(fn(Where $w) => $w->equalTo('id', $this->input('id')))
            ->update([
                'likes' => ['exp', '`likes`+1']
            ]);
    }

}