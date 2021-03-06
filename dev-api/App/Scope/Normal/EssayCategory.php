<?php

namespace App\Scope\Normal;

use Yonna\QuickStart\Mapping\Essay\EssayCategoryStatus;
use Yonna\QuickStart\Prism\EssayCategoryPrism;
use Yonna\Database\DB;
use Yonna\Database\Driver\Pdo\Where;
use Yonna\QuickStart\Scope\AbstractScope;
use Yonna\Throwable\Exception;

/**
 * Class EssayCategory
 * @package Yonna\QuickStart\Scope
 */
class EssayCategory extends AbstractScope
{

    const TABLE = 'essay_category';

    /**
     * @return mixed
     * @throws Exception\DatabaseException
     */
    public function multi(): array
    {
        $prism = new EssayCategoryPrism($this->request());
        return DB::connect()->table(self::TABLE)
            ->where(function (Where $w) use ($prism) {
                $w->equalTo('status', EssayCategoryStatus::ENABLE);
                $prism->getName() && $w->like('name', '%' . $prism->getName() . '%');
            })
            ->orderBy('sort', 'desc')
            ->multi();
    }

}