<?php

namespace App\Scope;

use Yonna\Database\DB;
use Yonna\Database\Driver\Pdo\Where;
use Yonna\QuickStart\Mapping\Essay\EssayCategoryStatus;
use Yonna\QuickStart\Mapping\Essay\EssayStatus;
use Yonna\QuickStart\Mapping\League\LeagueStatus;
use Yonna\QuickStart\Mapping\User\AccountType;
use Yonna\QuickStart\Mapping\User\UserStatus;
use Yonna\QuickStart\Scope\AbstractScope;
use Yonna\Throwable\Exception\DatabaseException;

class Stat extends AbstractScope
{


    /**
     * @return array
     * @throws DatabaseException
     */
    public function user(): array
    {
        $stat = [];
        foreach (UserStatus::toKv('label') as $k => $v) {
            $stat[$k] = [
                'key' => $k,
                'label' => $v,
                'value' => 0,
            ];
        }
        $userCount = DB::connect()
            ->table('user')
            ->field('count(`id`) as qty,status')
            ->groupBy('status')
            ->multi();
        foreach ($userCount as $u) {
            $stat[$u['user_status']]['value'] = $u['qty'];
        }
        return array_values($stat);
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public function account(): array
    {
        $stat = [];
        foreach (AccountType::toKv('label') as $k => $v) {
            $stat[$k] = [
                'key' => $k,
                'label' => $v,
                'value' => 0,
            ];
        }
        $userCount = DB::connect()
            ->table('user_account')
            ->field('count(`user_id`) as qty,type')
            ->groupBy('type')
            ->multi();
        foreach ($userCount as $u) {
            $stat[$u['user_account_type']]['value'] = $u['qty'];
        }
        return array_values($stat);
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public function essay(): array
    {
        $stat = [];
        foreach (EssayStatus::toKv('label') as $k => $v) {
            $stat[$k] = [
                'key' => $k,
                'label' => $v,
                'value' => 0,
            ];
        }
        $userCount = DB::connect()
            ->table('essay')
            ->field('count(`id`) as qty,status')
            ->groupBy('status')
            ->multi();
        foreach ($userCount as $u) {
            $stat[$u['essay_status']]['value'] = $u['qty'];
        }
        return array_values($stat);
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public function essayCategory(): array
    {
        $stat = [];
        foreach (EssayCategoryStatus::toKv('label') as $k => $v) {
            $stat[$k] = [
                'key' => $k,
                'label' => $v,
                'value' => 0,
            ];
        }
        $userCount = DB::connect()
            ->table('essay_category')
            ->field('count(`id`) as qty,status')
            ->groupBy('status')
            ->multi();
        foreach ($userCount as $u) {
            $stat[$u['essay_category_status']]['value'] = $u['qty'];
        }
        return array_values($stat);
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public function userGrow(): array
    {
        $res = DB::connect()
            ->table('user')
            ->field('id,register_time')
            ->where(fn(Where $w) => $w->notEqualTo('status', UserStatus::DELETE))
            ->multi();
        $tmp = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = date('Y-m-d H:i:s', strtotime(date('Y-m-01 23:59:59') . " -1day +1month -{$i}month"));
            $time = strtotime($d);
            $txt = date('Y年m月', $time);
            if (!isset($tmp[$txt])) {
                $tmp[$txt] = 0;
            }
            foreach ($res as $v) {
                if ($v['user_register_time'] <= $time) {
                    $tmp[$txt]++;
                }
            }
        }
        $stat = [];
        foreach ($tmp as $k => $v) {
            $stat[] = ['label' => $k, 'value' => $v];
        }
        return $stat;
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public function essayGrow(): array
    {
        $res = DB::connect()
            ->table('essay')
            ->field('id,publish_time')
            ->where(fn(Where $w) => $w->notEqualTo('status', LeagueStatus::DELETE))
            ->multi();
        $tmp = [];
        for ($i = 5; $i >= 0; $i--) {
            $d = date('Y-m-d H:i:s', strtotime(date('Y-m-01 23:59:59') . " -1day +1month -{$i}month"));
            $time = strtotime($d);
            $txt = date('Y年m月', $time);
            if (!isset($tmp[$txt])) {
                $tmp[$txt] = 0;
            }
            foreach ($res as $v) {
                if ($v['essay_publish_time'] <= $time) {
                    $tmp[$txt]++;
                }
            }
        }
        $stat = [];
        foreach ($tmp as $k => $v) {
            $stat[] = ['label' => $k, 'value' => $v];
        }
        return $stat;
    }


}