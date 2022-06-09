using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlaceTowers : MonoBehaviour
{
    public GameObject[] towerPrefabs;
    public GameObject towerParent;
    GameObject ghost;
    int? selected = null;
    // Start is called before the first frame update
    void Start()
    {
        Overseer.inBuyMode = false;
    }

    public void Choose(int tier)
    {
        selected = tier;
        if(ghost != null) Destroy(ghost.gameObject);
        ghost = null;
    }

    // Update is called once per frame
    void Update()
    {
        if(selected != null && Overseer.inBuyMode)
        {
            if(Input.GetMouseButtonDown(1))
            {
                selected = null;
                Overseer.inBuyMode = false;
            }
        }
        if(selected != null && !Overseer.inBuyMode)
        {
            Overseer.inBuyMode = true;
        }
        if(Overseer.inBuyMode && ghost == null)
        {
            var pos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            ghost = Instantiate(towerPrefabs[(int)selected], new Vector3(pos.x, pos.y, 0), Quaternion.identity, towerParent.transform); //smile
            ghost.GetComponent<SpriteRenderer>().color -= new Color(0, 0, 0, 0.4f);
            ghost.gameObject.name = "ghost";
        }
        if (!Overseer.inBuyMode && ghost != null)
        {
            Destroy(ghost.gameObject);
            ghost = null;
        }
        if(ghost != null) {
            var pos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            ghost.transform.position = new Vector3(pos.x, pos.y, 0);
            if(Input.GetMouseButtonDown(0)) BuyTower(ghost.GetComponent<TowerBehaviour>().price);
        }
        
    }
    bool BuyTower(int price)
    {
        if (Overseer.cash < price) return false;
        ghost.GetComponent<TowerBehaviour>().CheckPlacement();
        if (!ghost.GetComponent<TowerBehaviour>().canBePlaced) return false;
        ghost.GetComponent<SpriteRenderer>().color += new Color(0, 0, 0, 0.4f);
        Overseer.cash -= price;
        ghost.GetComponent<TowerBehaviour>().Begin();
        ghost = null;
        return true;
    }
}
